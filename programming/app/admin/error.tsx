"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="admin-login-page"><Card className="admin-login-card"><CardHeader><div className="admin-login-icon"><AlertTriangle /></div><CardTitle>Không thể tải dữ liệu quản trị</CardTitle><CardDescription>Kiểm tra lại MONGODB_URI trong .env.local và quyền truy cập MongoDB Atlas, sau đó thử lại.</CardDescription></CardHeader><CardContent><Button className="w-full" onClick={reset}><RefreshCw /> Thử kết nối lại</Button></CardContent></Card></main>;
}
