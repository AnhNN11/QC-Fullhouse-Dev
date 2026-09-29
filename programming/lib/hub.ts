import 'server-only';
import { ObjectId } from 'mongodb';
import { getMongoDatabase } from './mongodb';
import type { JudgeTest } from './grading';
export type ContestProblem = { id:number;title:string;statement:string;exampleInput:string;exampleOutput:string;constraints:string[];starterCode:string;tests:JudgeTest[] };
export type Contest = { title:string;description:string;startsAt:Date;endsAt:Date;status:'draft'|'published'|'cancelled';problems:ContestProblem[];createdAt:Date };
export function field(form:FormData,key:string,max=2000){const value=String(form.get(key)??'').trim();if(!value||value.length>max)throw new Error(`Thông tin ${key} không hợp lệ (tối đa ${max} ký tự).`);return value;}
export function objectId(value:string){if(!/^[a-f0-9]{24}$/i.test(value))throw new Error('ID không hợp lệ.');return new ObjectId(value);}
export function pageNumber(value:unknown){return typeof value==='string'&&/^\d+$/.test(value)?Math.min(10000,Math.max(1,Number(value))):1;}
export function contestState(c:Pick<Contest,'status'|'startsAt'|'endsAt'>,now=new Date()){return c.status==='cancelled'?'Đã hủy':c.status==='draft'?'Bản nháp':now<c.startsAt?'Sắp diễn ra':now>=c.endsAt?'Đã kết thúc':'Đang diễn ra';}
export function dateLabel(date:Date){return new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Ho_Chi_Minh'}).format(date)+' (VN)';}
let indexes:Promise<unknown>|undefined;
export async function hubDb(){const db=await getMongoDatabase();indexes??=Promise.all([
 db.collection('community_posts').createIndex({status:1,createdAt:-1}),db.collection('community_comments').createIndex({postId:1,createdAt:1}),
 db.collection('contest_submissions').createIndex({contestId:1,userId:1,problemId:1,createdAt:1}),db.collection('contest_entries').createIndex({contestId:1}),
 db.collection('hub_limits').createIndex({expiresAt:1},{expireAfterSeconds:0}),
]).catch(error=>{indexes=undefined;throw error;});await indexes;return db;}
export async function rateLimit(userId:string,scope:string,limit=10,seconds=60){const db=await hubDb();const window=Math.floor(Date.now()/(seconds*1000));const result=await db.collection<{_id:string;count:number;expiresAt:Date}>('hub_limits').findOneAndUpdate({_id:`${scope}:${userId}:${window}`},{$inc:{count:1},$setOnInsert:{expiresAt:new Date((window+2)*seconds*1000)}},{upsert:true,returnDocument:'after'});if(!result||result.count>limit)throw new Error('Bạn thao tác quá nhanh. Vui lòng thử lại sau.');}
export async function leaderboard(contestId:string){const db=await hubDb();return db.collection('contest_submissions').aggregate<{userId:string;name:string;score:number;solved:number;lastSolve:Date}>([
 {$match:{contestId,accepted:true}},{$group:{_id:{userId:'$userId',problemId:'$problemId'},firstSolve:{$min:'$createdAt'}}},
 {$group:{_id:'$_id.userId',solved:{$sum:1},lastSolve:{$max:'$firstSolve'}}},
 {$lookup:{from:'contest_entries',let:{uid:'$_id'},pipeline:[{$match:{$expr:{$and:[{$eq:['$userId','$$uid']},{$eq:['$contestId',contestId]},{$ne:['$disqualified',true]}]}}}],as:'entry'}},{$match:{'entry.0':{$exists:true}}},
 {$lookup:{from:'users',let:{uid:'$_id'},pipeline:[{$match:{$expr:{$eq:[{$toString:'$_id'},'$$uid']}}},{$project:{name:1}}],as:'user'}},
 {$sort:{solved:-1,lastSolve:1,_id:1}},{$limit:100},{$project:{_id:0,userId:'$_id',name:{$ifNull:[{$arrayElemAt:['$user.name',0]},'Học viên']},solved:1,score:{$multiply:['$solved',100]},lastSolve:1}},
]).toArray();}
