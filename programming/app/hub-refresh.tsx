'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
export default function HubRefresh(){const router=useRouter();const [pending,start]=useTransition();return <button className="hub-button" disabled={pending} onClick={()=>start(()=>router.refresh())}>{pending?'Đang cập nhật…':'Cập nhật trạng thái & kết quả ↻'}</button>;}
