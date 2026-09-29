import { getSessionUser,sameOrigin } from '@/lib/user-auth';
import { hubDb,objectId,type Contest } from '@/lib/hub';
import { grade,validateTests } from '@/lib/grading';
import type { SubmissionResult } from '@/lib/types';
export const runtime='nodejs';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!sameOrigin(request))return Response.json({error:'Yêu cầu không hợp lệ.'},{status:403});
 const user=await getSessionUser();if(!user)return Response.json({error:'Vui lòng đăng nhập.'},{status:401});
 const {id}=await params;if(!/^[a-f0-9]{24}$/i.test(id))return Response.json({error:'Không tìm thấy cuộc thi.'},{status:404});
 if(Number(request.headers.get('content-length'))>30000)return Response.json({error:'Lời giải quá dài.'},{status:413});
 const raw=await request.text();if(raw.length>30000)return Response.json({error:'Lời giải quá dài.'},{status:413});
 let body;try{body=JSON.parse(raw);}catch{return Response.json({error:'JSON không hợp lệ.'},{status:400});}
 if(!body||!Number.isSafeInteger(body.problemId)||typeof body.code!=='string'||!body.code.trim()||body.code.length>20000||typeof body.attemptId!=='string'||!/^[a-f0-9-]{36}$/i.test(body.attemptId))return Response.json({error:'Bài nộp không hợp lệ (JavaScript, tối đa 20.000 ký tự).'},{status:400});
 const db=await hubDb(),now=new Date();const contest=await db.collection<Contest>('contests').findOne({_id:objectId(id),status:'published'});
 if(!contest||now<contest.startsAt||now>=contest.endsAt)return Response.json({error:'Cuộc thi chưa bắt đầu, đã kết thúc hoặc đã hủy.'},{status:409});
 const entry=await db.collection('contest_entries').findOne({contestId:id,userId:user.id,disqualified:{$ne:true}});if(!entry)return Response.json({error:'Bạn chưa đăng ký hoặc đã bị loại khỏi cuộc thi.'},{status:403});
 const problem=contest.problems.find(p=>p.id===body.problemId);if(!problem)return Response.json({error:'Bài không thuộc cuộc thi.'},{status:400});
 type Attempt={_id:string;contestId:string;userId:string;problemId:number;code:string;createdAt:Date;status:string;accepted?:boolean;result?:SubmissionResult};
 const submissions=db.collection<Attempt>('contest_submissions'),attemptKey=`${id}:${user.id}:${body.attemptId}`;
 const previous=await submissions.findOne({_id:attemptKey});if(previous)return Response.json(previous.result??{error:previous.status==='error'?'Lượt chấm trước bị lỗi. Hãy nộp lượt mới.':'Lượt chấm đang xử lý; xem lịch sử trước khi nộp lại.'},{status:previous.result?200:409});
 const leases=db.collection<{_id:string;expiresAt:Date}>('judge_leases');await leases.updateOne({_id:user.id},{$setOnInsert:{expiresAt:new Date(0)}},{upsert:true});if(!await leases.findOneAndUpdate({_id:user.id,expiresAt:{$lte:now}},{$set:{expiresAt:new Date(Date.now()+12000)}}))return Response.json({error:'Vui lòng chờ 12 giây giữa hai lượt chấm.'},{status:429});
 try{await submissions.insertOne({_id:attemptKey,contestId:id,userId:user.id,problemId:problem.id,code:body.code,createdAt:now,status:'judging'});}catch{return Response.json({error:'Lượt nộp đã được tiếp nhận. Kiểm tra lịch sử.'},{status:409});}
 try{const result=await grade(body.code,validateTests(problem.tests));await submissions.updateOne({_id:attemptKey},{$set:{status:'graded',accepted:result.accepted,result}});return Response.json(result,{headers:{'Cache-Control':'no-store'}});}
 catch{await submissions.updateOne({_id:attemptKey},{$set:{status:'error'}});return Response.json({error:'Máy chấm bận hoặc gặp lỗi. Lượt này không được tính điểm; hãy thử lại.'},{status:503});}
}
