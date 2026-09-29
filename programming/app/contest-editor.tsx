'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SubmissionResult } from '@/lib/types';
export default function ContestEditor({contestId,problemId,starter}:{contestId:string;problemId:number;starter:string}){
 const [code,setCode]=useState(starter),[busy,setBusy]=useState(false),[message,setMessage]=useState('');const router=useRouter();
 async function submit(){if(busy)return;setBusy(true);setMessage('Đang chấm bằng bộ test của cuộc thi…');try{const response=await fetch(`/api/contests/${contestId}/submit`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({problemId,code,attemptId:crypto.randomUUID()})});const data=await response.json() as SubmissionResult&{error?:string};setMessage(response.ok?`${data.accepted?'Đạt · 100 điểm':'Chưa đạt · 0 điểm'} — ${data.passed}/${data.total} test. ${data.message}`:data.error??'Chưa nộp được.');router.refresh();}catch{setMessage('Mất kết nối. Kiểm tra lịch sử bài nộp trước khi thử lại.');}finally{setBusy(false);}}
 return <div className="hub-editor"><label htmlFor={`code-${problemId}`}>Lời giải JavaScript · hàm solve · tối đa 20.000 ký tự</label><textarea id={`code-${problemId}`} spellCheck={false} value={code} onChange={e=>setCode(e.target.value)} rows={12} maxLength={20000}/><button onClick={()=>void submit()} disabled={busy||!code.trim()}>{busy?'Đang chấm…':'Nộp bài'}</button><p role="status">{message}</p></div>;
}
