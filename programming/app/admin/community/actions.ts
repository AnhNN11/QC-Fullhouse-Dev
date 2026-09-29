'use server';
import { revalidatePath } from 'next/cache';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { field,hubDb,objectId } from '@/lib/hub';
import type { ActionState } from '@/app/academy/actions';
export async function moderate(_:ActionState,form:FormData):Promise<ActionState>{
 if(!await isAdminAuthenticated())return {error:'Vui lòng đăng nhập admin.'};
 try{const db=await hubDb();const action=field(form,'action'),id=field(form,'id');let postId='';
 if(action==='post'||action==='comment'){const status=field(form,'status');if(!['published','hidden','pending'].includes(status))throw new Error('Trạng thái không hợp lệ.');const collection=db.collection(action==='post'?'community_posts':'community_comments');const item=await collection.findOne({_id:objectId(id)});if(!item)throw new Error('Nội dung không tồn tại.');await collection.updateOne({_id:item._id},{$set:{status,moderatedAt:new Date()}});postId=action==='post'?id:item.postId;}
 else if(action==='resolve'){const result=await db.collection<{_id:string;status:string}>('community_reports').updateOne({_id:id},{$set:{status:'resolved'}});if(!result.matchedCount)throw new Error('Báo cáo không tồn tại.');}
 else if(action==='block'){const result=await db.collection('users').updateOne({_id:objectId(id)},{$set:{communityBlocked:form.get('blocked')==='true'}});if(!result.matchedCount)throw new Error('Tài khoản không tồn tại.');}
 else throw new Error('Thao tác không hợp lệ.');
 await db.collection('admin_audit').insertOne({area:'community',action,target:id,createdAt:new Date()});revalidatePath('/admin/community');revalidatePath('/community');if(postId)revalidatePath(`/community/${postId}`);return {success:'Đã cập nhật kiểm duyệt.'};
 }catch(error){return {error:error instanceof Error?error.message:'Lỗi kiểm duyệt.'};}
}
