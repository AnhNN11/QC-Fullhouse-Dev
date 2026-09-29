import { isAdminAuthenticated } from '@/lib/admin-auth';
import { sameOrigin } from '@/lib/user-auth';
import { mailConfigured, sendDolphinEmail } from '@/lib/mailer';
import { validateEmailDraft } from '@/lib/email-template';
import { getMongoDatabase } from '@/lib/mongodb';
export const runtime='nodejs';
export async function POST(request:Request) {
 if(!sameOrigin(request)) return Response.json({error:'Yêu cầu không hợp lệ.'},{status:403});
 if(!await isAdminAuthenticated()) return Response.json({error:'Vui lòng đăng nhập admin.'},{status:401});
 if(!mailConfigured()) return Response.json({error:'Chưa cấu hình SMTP. Bạn vẫn có thể soạn và xem trước thư.'},{status:503});
 const input=await request.json().catch(()=>null);
 let draft;try{draft=validateEmailDraft(input?.draft);}catch(e){return Response.json({error:e instanceof Error?e.message:'Nội dung không hợp lệ.'},{status:400});}
 if(typeof input?.requestId!=='string'||!/^[a-f0-9-]{36}$/.test(input.requestId)) return Response.json({error:'Mã gửi không hợp lệ.'},{status:400});
 const db=await getMongoDatabase();
 if(await db.collection('newsletter_requests').findOne({email:draft.to.toLowerCase(),status:'suppressed'})) return Response.json({error:'Địa chỉ này đã được đánh dấu không nhận thư.'},{status:400});
 const logs=db.collection<{_id:string;to:string;subject:string;status:string;createdAt:Date;messageId?:string}>('email_deliveries');
 const prior=await logs.findOne({_id:input.requestId});
 if(prior) return Response.json({error:'Yêu cầu này đã được xử lý. Kiểm tra lịch sử trước khi gửi lại.'},{status:409});
 const minute=Math.floor(Date.now()/60000);
 const throttle=await db.collection<{_id:string;count:number;expiresAt:Date}>('email_rate_limits').findOneAndUpdate({_id:String(minute)},{$inc:{count:1},$set:{expiresAt:new Date(Date.now()+3600000)}},{upsert:true,returnDocument:'after'});
 if((throttle?.count??0)>10) return Response.json({error:'Tối đa 10 thư mỗi phút. Vui lòng thử lại sau.'},{status:429});
 try{await logs.insertOne({_id:input.requestId,to:draft.to,subject:draft.subject,status:'sending',createdAt:new Date()});}catch{return Response.json({error:'Yêu cầu đang được xử lý.'},{status:409});}
 try {
  const result=await sendDolphinEmail(draft);
  await logs.updateOne({_id:input.requestId},{$set:{status:'accepted',messageId:result.messageId}});
  return Response.json({success:true,message:'Máy chủ SMTP đã nhận thư. Trạng thái này chưa xác nhận thư vào hộp thư đến.'});
 }catch{
  await logs.updateOne({_id:input.requestId},{$set:{status:'uncertain'}});
  return Response.json({error:'Chưa xác nhận được kết quả gửi. Kiểm tra hộp thư gửi/SMTP trước khi gửi lại để tránh trùng thư.'},{status:502});
 }
}
