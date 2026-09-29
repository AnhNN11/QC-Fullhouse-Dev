'use server';
import { revalidatePath } from 'next/cache';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { field,hubDb,objectId,type Contest,type ContestProblem } from '@/lib/hub';
import { validateTests } from '@/lib/grading';
import type { ActionState } from '@/app/academy/actions';
export async function manageContest(_:ActionState,form:FormData):Promise<ActionState>{
 if(!await isAdminAuthenticated())return {error:'Vui lòng đăng nhập admin.'};
 try{const db=await hubDb(),action=field(form,'action');let id=String(form.get('id')??'');
 if(action==='save'){
  const title=field(form,'title',160),description=field(form,'description',4000);const startsAt=new Date(field(form,'startsAt',30)+'+07:00'),endsAt=new Date(field(form,'endsAt',30)+'+07:00');
  if(!Number.isFinite(startsAt.getTime())||!Number.isFinite(endsAt.getTime())||startsAt<=new Date()||endsAt<=startsAt||endsAt.getTime()-startsAt.getTime()>7*86400000)throw new Error('Lịch không hợp lệ: bắt đầu trong tương lai, thời lượng tối đa 7 ngày (giờ VN).');
  const ids=field(form,'problemIds',300).split(',').map(s=>Number(s.trim()));if(ids.length<1||ids.length>10||ids.some(n=>!Number.isSafeInteger(n)||n<=0)||new Set(ids).size!==ids.length)throw new Error('Chọn 1–10 ID bài khác nhau, phân cách dấu phẩy.');
  const problems:ContestProblem[]=[];for(const problemId of ids){const [p,c]=await Promise.all([db.collection('problems').findOne({id:problemId}),db.collection('judge_configs').findOne({problemId,enabled:true})]);if(!p||!c)throw new Error(`Bài #${problemId} chưa có đề hoặc bộ test được duyệt.`);problems.push({id:problemId,title:p.title,statement:p.statement,exampleInput:p.exampleInput,exampleOutput:p.exampleOutput,constraints:p.constraints??[],starterCode:p.starterCode,tests:validateTests(c.tests)});}
  const status=form.get('published')==='on'?'published':'draft';
  if(id){const result=await db.collection<Contest>('contests').updateOne({_id:objectId(id),startsAt:{$gt:new Date()},status:{$ne:'cancelled'}},{$set:{title,description,startsAt,endsAt,status,problems}});if(!result.matchedCount)throw new Error('Chỉ sửa cuộc thi chưa bắt đầu và chưa hủy.');}
  else{id=(await db.collection<Contest>('contests').insertOne({title,description,startsAt,endsAt,status,problems,createdAt:new Date()})).insertedId.toString();}
 }else if(action==='cancel'){const result=await db.collection<Contest>('contests').updateOne({_id:objectId(id)},{$set:{status:'cancelled'}});if(!result.matchedCount)throw new Error('Không tìm thấy cuộc thi.');}
 else if(action==='entry'){const userId=field(form,'userId');objectId(userId);const result=await db.collection('contest_entries').updateOne({contestId:id,userId},{$set:{disqualified:form.get('disqualified')==='true',reason:field(form,'reason',500)}});if(!result.matchedCount)throw new Error('Không tìm thấy lượt đăng ký.');}
 else throw new Error('Thao tác không hợp lệ.');
 await db.collection('admin_audit').insertOne({area:'contest',action,target:id,createdAt:new Date()});revalidatePath('/admin/contests');revalidatePath('/contests');revalidatePath(`/contests/${id}`);return {success:'Đã cập nhật cuộc thi.'};
 }catch(error){return {error:error instanceof Error?error.message:'Chưa lưu được.'};}
}
