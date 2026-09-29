"use client";

import { useActionState } from "react";
import { LockKeyhole, Loader2 } from "lucide-react";
import { loginAdmin } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Brand from "../brand";

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, undefined);
  return (
    <main className="admin-login-page">
      <Card className="admin-login-card">
        <CardHeader className="gap-4">
          <Brand />
          <div className="admin-login-icon"><LockKeyhole /></div>
          <div>
            <CardTitle className="text-2xl">Đăng nhập quản trị</CardTitle>
            <CardDescription className="mt-2">Quản lý nội dung học tập và theo dõi hoạt động hệ thống.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form action={action} className="grid gap-5">
            <div className="grid gap-2"><Label htmlFor="username">Tài khoản</Label><Input id="username" name="username" autoComplete="username" required /></div>
            <div className="grid gap-2"><Label htmlFor="password">Mật khẩu</Label><Input id="password" name="password" type="password" autoComplete="current-password" required /></div>
            {state?.error && <p className="admin-form-error" role="alert">{state.error}</p>}
            <Button type="submit" size="lg" disabled={pending}>{pending && <Loader2 className="animate-spin" />}Đăng nhập</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
