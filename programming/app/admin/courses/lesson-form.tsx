'use client';
import { useState, useTransition, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { manageAcademy, type ActionState } from '@/app/academy/actions';
import { Button } from '@/components/ui/button';
export default function LessonForm({children,label,resetAfterSave=false}:{children:ReactNode;label:string;resetAfterSave?:boolean}){
 const [state,setState]=useState<ActionState>({});const [pending,startTransition]=useTransition();const router=useRouter();
 return <form className="academy-form" onSubmit={event=>{event.preventDefault();if(pending)return;const form=event.currentTarget;const values=new FormData(form);setState({});startTransition(async()=>{try{const result=await manageAcademy({},values);setState(result);if(result.success){if(resetAfterSave)form.reset();router.refresh();}}catch{setState({error:'Chưa xác nhận được kết quả lưu. Tải lại trang để kiểm tra trước khi thử lại.'});}});}}><fieldset disabled={pending} className="cc-lesson-fields">{children}</fieldset><Button disabled={pending} type="submit">{pending?'Đang lưu…':label}</Button><div aria-live="polite">{state.error&&<p role="alert" className="cc-error">{state.error}</p>}{state.success&&<p className="cc-success">{state.success}</p>}</div></form>;
}
