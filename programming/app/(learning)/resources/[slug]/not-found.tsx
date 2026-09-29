import Link from "next/link";
import "@/app/resources.css";
export default function ResourceNotFound() {
  return <main className="resources-page"><h1>Không tìm thấy bài thực hành</h1><p>Liên kết không hợp lệ hoặc bài không còn trong thư viện.</p><Link href="/resources">← Quay lại tài nguyên & thực hành</Link></main>;
}
