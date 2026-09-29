import Link from 'next/link';

export default function LessonNotFound() {
  return <section className="academy"><h1>Không tìm thấy khóa học hoặc bài học</h1><p>Liên kết không hợp lệ, bài học chưa được xuất bản hoặc không thuộc khóa học này.</p><Link href="/courses">← Quay lại thư viện khóa học</Link></section>;
}
