"use client";

import Link from "next/link";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="dashboard-error"><div><span>!</span><h1>Chưa thể tải không gian học</h1><p>Kết nối dữ liệu đang gián đoạn. Hãy kiểm tra cấu hình MongoDB rồi thử lại.</p><button onClick={reset}>Thử lại</button><Link href="/">Về trang chủ</Link></div></main>;
}
