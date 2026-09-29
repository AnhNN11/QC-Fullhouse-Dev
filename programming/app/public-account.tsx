'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthDialog from './auth-dialog';
import AccountDropdown from './account-dropdown';
import type { SessionUser } from '@/lib/user-auth';
export default function PublicAccount({user, label='Đăng nhập / Đăng ký'}:{user?:SessionUser|null;label?:string}) {
  const [open,setOpen]=useState(false); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);const router=useRouter();
  async function logout(){setBusy(true);try {const response=await fetch('/api/auth',{method:'DELETE'});if(!response.ok)throw new Error();router.refresh();}catch{setError('Chưa đăng xuất được. Thử lại nhé.');}finally{setBusy(false);}}
  return <div className="hub-account">{user?<AccountDropdown user={user} pending={busy} logout={()=>void logout()}/>:<button onClick={()=>setOpen(true)}>{label}</button>}{error&&<p role="alert">{error}</p>}<AuthDialog open={open} onOpenChange={setOpen} onSuccess={()=>router.refresh()}/></div>;
}
