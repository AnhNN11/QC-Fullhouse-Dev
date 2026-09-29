import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { mailConfigured } from '@/lib/mailer';
import { getMongoDatabase } from '@/lib/mongodb';
import EmailStudio from './studio';
export const dynamic='force-dynamic';
export default async function EmailPage(){
 if(!await isAdminAuthenticated()) redirect('/admin');
 const db=await getMongoDatabase();
 const logs=await db.collection('email_deliveries').find({},{projection:{to:1,subject:1,status:1,createdAt:1}}).sort({createdAt:-1}).limit(15).toArray();
 return <EmailStudio configured={mailConfigured()} history={logs.map(l=>({id:l._id.toString(),to:String(l.to),subject:String(l.subject),status:String(l.status),date:new Date(l.createdAt).toISOString()}))}/>;
}
