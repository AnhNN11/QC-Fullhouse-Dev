'use server';
import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/user-auth';
import { field,hubDb,objectId,rateLimit,type Contest } from '@/lib/hub';
import type { ActionState } from './academy/actions';
export async function joinContest(_:ActionState,form:FormData):Promise<ActionState>{
 try{const user=await getSessionUser();if(!user)throw new Error('Vui lòng đăng nhập để đăng ký.');await rateLimit(user.id,'contest-register');const id=field(form,'contestId');const db=await hubDb();const contest=await db.collection<Contest>('contests').findOne({_id:objectId(id),status:'published'});if(!contest||contest.endsAt<=new Date())throw new Error('Cuộc thi không còn nhận đăng ký.');
 if(form.get('agree')!=='on')throw new Error('Vui lòng đồng ý thể lệ và hiển thị tên trên bảng xếp hạng.');
 const entries=db.collection<{_id:string;contestId:string;userId:string;registeredAt:Date;disqualified:boolean}>('contest_entries');const existing=await entries.findOne({_id:`${id}:${user.id}`});if(existing?.disqualified)throw new Error('Bạn đã bị loại khỏi cuộc thi này.');await entries.updateOne({_id:`${id}:${user.id}`},{$setOnInsert:{contestId:id,userId:user.id,registeredAt:new Date(),disqualified:false}},{upsert:true});revalidatePath(`/contests/${id}`);return {success:'Đăng ký thành công. Đề mở khi cuộc thi bắt đầu.'};
 }catch(error){return {error:error instanceof Error?error.message:'Chưa đăng ký được.'};}
}
