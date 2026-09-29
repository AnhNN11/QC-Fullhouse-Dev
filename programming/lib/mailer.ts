import 'server-only';
import nodemailer from 'nodemailer';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { renderEmail, validateEmailDraft, type EmailDraft } from './email-template';
export function mailConfigured() {return !!(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASSWORD&&process.env.SMTP_FROM);}
export async function sendDolphinEmail(draft:EmailDraft) {
 const d=validateEmailDraft(draft);
 if(!mailConfigured()) throw new Error('SMTP chưa được cấu hình.');
 const port=Number(process.env.SMTP_PORT||587);
 if(![465,587].includes(port)) throw new Error('SMTP_PORT phải là 465 hoặc 587.');
 const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port,secure:port===465,requireTLS:port===587,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:20000,disableFileAccess:true,disableUrlAccess:true});
 const {html,text}=renderEmail(d,'cid:dolphinx-course');
 const graphic=await readFile(path.join(process.cwd(),'public/brand/course-coding-mascot-v4.png'));
 const info=await transport.sendMail({from:{name:'DolphinX Education',address:process.env.SMTP_FROM!},replyTo:process.env.SMTP_REPLY_TO||process.env.SMTP_FROM,to:{name:d.recipient,address:d.to},subject:d.subject,html,text,attachments:[{filename:'dolphinx.png',content:graphic,cid:'dolphinx-course',contentType:'image/png'}]});
 if(!info.accepted.length) throw new Error('Máy chủ email chưa chấp nhận người nhận.');
 return {messageId:info.messageId};
}
