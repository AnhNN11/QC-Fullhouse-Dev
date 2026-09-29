import {test} from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import ts from 'typescript';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../lib/email-template.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {validateEmailDraft,renderEmail,emailPresets}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const draft={...emailPresets.welcome,to:'learner@example.com',recipient:'Minh Anh',theme:'welcome'};
test('rejects multiple recipients, header injection and unsafe links',()=>{
 for(const changes of [{to:'a@example.com,b@example.com'},{subject:'hello\r\nBcc: x@example.com'},{ctaUrl:'javascript:alert(1)'},{ctaUrl:'https://user:secret@example.com'}]) assert.throws(()=>validateEmailDraft({...draft,...changes}));
});
test('escapes user content and omits empty action links',()=>{
 const {html,text}=renderEmail({...draft,body:'<script>alert(1)</script> & hello'});
 assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<a href='));assert.ok(text.includes('hello'));
});
test('creates a MIME email with inline image without sending via network',async()=>{
 const {html,text}=renderEmail(draft,'cid:dolphinx-course');
 const transport=nodemailer.createTransport({streamTransport:true,buffer:true,newline:'unix'});
 const info=await transport.sendMail({from:'DolphinX <test@example.com>',to:draft.to,subject:draft.subject,html,text,attachments:[{filename:'dolphinx.png',content:await readFile(new URL('../public/brand/course-coding-mascot-v4.png',import.meta.url)),cid:'dolphinx-course'}]});
 const mime=info.message.toString();assert.ok(mime.includes('multipart/related'));assert.ok(mime.includes('Content-ID: <dolphinx-course>'));assert.ok(mime.includes('text/plain'));assert.ok(mime.includes('text/html'));
});
