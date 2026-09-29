"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, UserRound, BookOpen, ShieldCheck, LogOut } from "lucide-react";
import type { SessionUser } from "@/lib/user-auth";
import "./account-dropdown.css";

export default function AccountDropdown({ user, pending, logout }: { user: SessionUser; pending: boolean; logout: () => void }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => { if (ref.current) ref.current.open = false; };
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !ref.current?.contains(event.target)) close(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && ref.current?.open) { close(); ref.current.querySelector("summary")?.focus(); } };
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);
  const initials = user.name.split(/\s+/).slice(-2).map(part => part[0]).join("").toUpperCase();
  return <details className="account-dropdown" ref={ref} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close(); }}><summary aria-label="Mở menu tài khoản"><span className="account-avatar">{initials}</span><span className="account-trigger-name"><strong>{user.name}</strong><small>Học viên</small></span><ChevronDown size={15}/></summary><div className="account-panel"><div className="account-identity"><strong>{user.name}</strong><small>{user.email}</small></div><nav aria-label="Tài khoản"><Link href="/profile" onClick={close}><UserRound size={17}/>Hồ sơ cá nhân</Link><Link href="/profile#my-learning" onClick={close}><BookOpen size={17}/>Khóa học của tôi</Link><Link href="/profile#security" onClick={close}><ShieldCheck size={17}/>Bảo mật tài khoản</Link></nav><button type="button" disabled={pending} onClick={logout}><LogOut size={17}/>{pending ? "Đang đăng xuất…" : "Đăng xuất"}</button></div></details>;
}
