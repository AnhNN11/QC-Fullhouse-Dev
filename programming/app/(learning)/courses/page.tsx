import Image from "next/image";
import CourseCatalog from "@/app/course-catalog";
import MyEnrollments from "@/app/my-enrollments";
import Link from "next/link";
import { getMongoDatabase } from "@/lib/mongodb";
import type { Course } from "@/lib/types";
import "@/app/course-catalog.css";

export const dynamic = "force-dynamic";
export default async function CoursesPage() {
  let courses: Course[] = [];
  let unavailable = false;
  try { courses = await (await getMongoDatabase()).collection<Course>("courses").find({}, { projection: { _id: 0 } }).toArray(); } catch { unavailable = true; }
  return <main className="catalog-page"><section className="catalog-hero"><div className="catalog-hero-copy"><span className="catalog-eyebrow">DOLPHINX LEARNING CLUB</span><h1>Mỗi kỹ năng mới.<br/><em>Một bước tiến xa.</em></h1><p>Từ dòng code đầu tiên đến sản phẩm của riêng bạn. Chọn một khóa học và bắt đầu theo nhịp của mình.</p><div className="catalog-hero-actions"><a href="#catalog">Khám phá khóa học ↗</a><Link href="/consultation">Tư vấn chọn khóa học →</Link></div><div className="catalog-hero-note">01. Khám phá　→　02. Đăng ký　→　03. Thực hành</div></div><div className="catalog-hero-art"><Image src="/brand/course-coding-mascot-v3.png" alt="Cá heo DolphinX đồng hành cùng bạn học lập trình" width={1672} height={941} priority sizes="(max-width: 700px) 90vw, 40vw"/><span className="catalog-art-label">Học một chút mỗi ngày<strong>Build something real.</strong></span></div></section><div className="catalog-benefits"><span>▤ Giáo trình theo từng chương</span><span>⌘ Học đi cùng thực hành</span><Link href="/consultation">↗ Mentor 1:1 khi bạn cần</Link></div>{!unavailable && <MyEnrollments/>}{unavailable ? <p role="alert">Chưa thể tải thư viện. Vui lòng tải lại trang sau.</p> : <CourseCatalog courses={courses}/>}</main>;
}
