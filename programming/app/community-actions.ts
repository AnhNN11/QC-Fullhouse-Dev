'use server';
import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/user-auth';
import { field,hubDb,objectId,rateLimit } from '@/lib/hub';
import type { ActionState } from './academy/actions';
export async function communityAction(_:ActionState,form:FormData):Promise<ActionState>{
 try{const user=await getSessionUser();if(!user)throw new Error('Vui lòng đăng nhập.');const db=await hubDb();
 if((await db.collection('users').findOne({_id:objectId(user.id)},{projection:{communityBlocked:1}}))?.communityBlocked)throw new Error('Tài khoản đã bị hạn chế tương tác cộng đồng.');
 const action=field(form,'action');await rateLimit(user.id,'community',20);const postId=String(form.get('postId')??'');
 if(action==='post'){await rateLimit(user.id,'post',3,300);const title=field(form,'title',160),body=field(form,'body',6000),category=field(form,'category',30);if(!['Hỏi đáp','Chia sẻ','Dự án'].includes(category))throw new Error('Chủ đề không hợp lệ.');await db.collection('community_posts').insertOne({userId:user.id,authorName:user.name,title,body,category,status:'pending',createdAt:new Date(),updatedAt:new Date()});}
 else{
  const post=await db.collection('community_posts').findOne({_id:objectId(postId)});if(!post)throw new Error('Bài viết không tồn tại.');
  if(action==='edit'||action==='remove'){if(post.userId!==user.id)throw new Error('Bạn không có quyền sửa bài này.');await db.collection('community_posts').updateOne({_id:post._id,userId:user.id},{$set:action==='remove'?{status:'hidden',updatedAt:new Date()}:{title:field(form,'title',160),body:field(form,'body',6000),status:'pending',updatedAt:new Date()}});}
  else if(action==='commentEdit'||action==='commentRemove'){const commentId=objectId(field(form,'commentId'));const comment=await db.collection('community_comments').findOne({_id:commentId,postId,userId:user.id});if(!comment)throw new Error('Bạn không có quyền sửa bình luận này.');await db.collection('community_comments').updateOne({_id:commentId,userId:user.id},{$set:action==='commentRemove'?{status:'hidden',updatedAt:new Date()}:{body:field(form,'body',2000),status:'pending',updatedAt:new Date()}});}
  else{if(post.status!=='published')throw new Error('Bài viết chưa được công khai.');
   if(action==='comment'){await rateLimit(user.id,'comment',5,60);await db.collection('community_comments').insertOne({postId,userId:user.id,authorName:user.name,body:field(form,'body',2000),status:'pending',createdAt:new Date()});}
   else if(action==='like'){const likes=db.collection<{_id:string;postId:string;userId:string}>('community_likes');const id=`${postId}:${user.id}`;if(form.get('liked')==='true')await likes.updateOne({_id:id},{$setOnInsert:{postId,userId:user.id}},{upsert:true});else await likes.deleteOne({_id:id});}
   else if(action==='report'){const commentId=String(form.get('commentId')??'');if(commentId&&!await db.collection('community_comments').findOne({_id:objectId(commentId),postId,status:'published'}))throw new Error('Bình luận không tồn tại.');await db.collection<{_id:string;postId:string;commentId:string;userId:string;reason:string;status:string;createdAt:Date}>('community_reports').updateOne({_id:`${postId}:${commentId}:${user.id}`},{$setOnInsert:{postId,commentId,userId:user.id,reason:field(form,'reason',500),status:'open',createdAt:new Date()}},{upsert:true});}
   else throw new Error('Thao tác không được hỗ trợ.');
  }
 }
 revalidatePath('/community');if(postId)revalidatePath(`/community/${postId}`);revalidatePath('/admin/community');return {success:['post','comment','edit','commentEdit'].includes(action)?'Đã gửi nội dung để admin duyệt.':'Đã cập nhật.'};
 }catch(error){return {error:error instanceof Error?error.message:'Chưa thực hiện được.'};}
}
