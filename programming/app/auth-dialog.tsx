"use client";
import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { SessionUser } from "@/lib/user-auth";
import "./auth.css";
import { useLearningContext } from './learning-context';
import { useRouter } from 'next/navigation';

export default function AuthDialog({ open, onOpenChange, onSuccess }: { open: boolean; onOpenChange: (value: boolean) => void; onSuccess: (user: SessionUser) => void }) {
  const learning = useLearningContext();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    setPending(true); setError("");
    try {
      const response = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, name: form.get("name"), email: form.get("email"), password: form.get("password"), confirmPassword: form.get("confirmPassword") }) });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Vui lòng thử lại."); return; }
      learning?.setUser(result.user);
      onSuccess(result.user); onOpenChange(false); router.refresh();
    } catch { setError("Không thể kết nối. Vui lòng thử lại."); }
    finally { setPending(false); }
  }
  return <Dialog open={open} onOpenChange={value => { if (!pending) { setError(""); onOpenChange(value); } }}>
    <DialogContent className="dx-auth-dialog">
      <div className="dx-auth-brand"><Image src="/brand/bright-logo.png" alt="" width={46} height={46}/><strong>DolphinX <span>LEARNING TOGETHER</span></strong></div>
      <DialogTitle className="dx-auth-title">{mode === "login" ? "Chào mừng bạn trở lại" : "Bắt đầu hành trình của bạn"}</DialogTitle>
      <DialogDescription>Đăng nhập để học và lưu tiến độ riêng của bạn. Quyền truy cập từng khóa học vẫn được áp dụng.</DialogDescription>
      <div className="dx-auth-switch"><button type="button" disabled={pending} aria-pressed={mode === "login"} onClick={() => { setMode("login"); setError(""); }}>Đăng nhập</button><button type="button" disabled={pending} aria-pressed={mode === "register"} onClick={() => { setMode("register"); setError(""); }}>Đăng ký</button></div>
      <form key={mode} onSubmit={submit} className="dx-auth-form">
        {mode === "register" && <label>Họ và tên<input name="name" autoComplete="name" required minLength={2} maxLength={80} disabled={pending}/></label>}
        <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} disabled={pending}/></label>
        <label>Mật khẩu<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} maxLength={128} disabled={pending}/></label>
        {mode === "register" && <><small>Dùng mật khẩu từ 8–128 ký tự, không dùng lại mật khẩu ở nơi khác.</small><label>Nhập lại mật khẩu<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} maxLength={128} disabled={pending}/></label></>}
        {error && <p role="alert" className="dx-auth-error">{error}</p>}
        <button type="submit" className="dx-auth-submit" disabled={pending}>{pending ? "Đang xử lý…" : mode === "login" ? "Đăng nhập & tiếp tục" : "Tạo tài khoản & tiếp tục"}</button>
      </form>
    </DialogContent>
  </Dialog>;
}
