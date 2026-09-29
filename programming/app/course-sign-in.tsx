"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthDialog from "./auth-dialog";

export default function CourseSignIn({ autoOpen = true }: { autoOpen?: boolean }) {
  const [open, setOpen] = useState(autoOpen);
  const router = useRouter();
  return <section className="dx-course-login"><h2>Sẵn sàng vào học?</h2><p>Đăng nhập để xem bài học và lưu hành trình riêng. Khóa có mã truy cập vẫn cần được cấp quyền; đăng ký tài khoản không tự mở khóa tất cả bài học.</p><button onClick={() => setOpen(true)}>Đăng nhập / Đăng ký để học</button><Link href="/dashboard">← Khám phá dashboard</Link><AuthDialog open={open} onOpenChange={setOpen} onSuccess={() => router.refresh()}/></section>;
}
