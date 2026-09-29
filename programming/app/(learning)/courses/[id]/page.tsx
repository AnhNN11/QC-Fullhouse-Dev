import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BookOpen, Check, Play, ShieldCheck } from "lucide-react";
import { getMongoDatabase } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/user-auth";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { enrollmentKey, type Enrollment } from "@/lib/enrollment";
import CourseIntro from "@/app/course-intro";
import CourseSignIn from "@/app/course-sign-in";
import AcademyForm from "@/app/academy/form";
import { enrollCourse } from "@/app/enrollment-actions";
import "@/app/academy.css";
import "@/app/course-detail.css";

export const dynamic = "force-dynamic";

export default async function CourseDetail({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lesson?: string | string[] }>;
}) {
  const { id } = await params;
  const { lesson } = await searchParams;
  const db = await getMongoDatabase();
  const course = await db.collection("courses").findOne({ id });
  if (!course) notFound();
  const lessons = await db.collection("video_lessons").find({ courseId: id, published: true }, { projection: { encryptedVideo: 0 } }).sort({ order: 1, _id: 1 }).toArray();
  if (lesson !== undefined && (typeof lesson !== "string" || !lessons.some(item => item._id.toString() === lesson))) notFound();
  const [user, admin] = await Promise.all([getSessionUser(), isAdminAuthenticated()]);
  const enrollment = user ? await db.collection<Enrollment>("course_enrollments").findOne({ _id: enrollmentKey(user.id, id) }) : null;
  const enrolled = enrollment?.status === "active";
  if (lesson !== undefined && (enrolled || admin)) redirect(`/courses/${encodeURIComponent(id)}/learn?lesson=${lesson}`);
  const modules = [...new Set(lessons.map(item => String(item.module || "Bài học")))];
  const objectives = [...new Set([...(course.outcomes ?? []), ...lessons.map(item => String(item.objective || "")).filter(Boolean)])];
  const prerequisites = [...new Set([...(course.prerequisites ?? []), ...lessons.map(item => String(item.prerequisite || "")).filter(Boolean)])];
  const demoCount = lessons.filter(item => item.demo === true).length;
  return <main className="academy course-detail">
    <nav className="cd-breadcrumb" aria-label="Đường dẫn"><Link href="/courses">Khóa học</Link><span>/</span><span>{course.title}</span></nav>
    <div className="cd-layout"><div className="cd-content">
      <section className="cd-hero"><span className="cd-eyebrow">DOLPHINX CLASSROOM · {course.level}</span><h1>{course.title}</h1><p>{course.description}</p>{course.audience && <p><strong>Dành cho: </strong>{course.audience}</p>}<div className="cd-facts"><span><BookOpen size={16}/>{modules.length} chương</span><span><Play size={16}/>{lessons.length} bài đã xuất bản</span><span>Học theo nhịp của bạn</span></div><a className="cd-text-link" href="#curriculum">Khám phá chương trình học ↓</a></section>
      <nav className="cd-tabs" aria-label="Nội dung khóa học"><a href="#outcomes">Bạn sẽ học được gì</a><a href="#curriculum">Giáo trình</a><a href="#requirements">Chuẩn bị</a></nav>
      <section className="cd-panel" id="outcomes"><span className="cd-eyebrow">TỪ HIỂU ĐẾN LÀM ĐƯỢC</span><h2>Bạn sẽ học được gì?</h2>{objectives.length ? <ul className="cd-outcomes">{objectives.map(item => <li key={item}><Check size={18}/><span>{item}</span></li>)}</ul> : <p>Mục tiêu chi tiết đang được đội ngũ cập nhật.</p>}</section>
      <section className="cd-panel" id="curriculum"><div className="cd-section-heading"><div><span className="cd-eyebrow">TỪNG BƯỚC MỘT</span><h2>Nội dung khóa học</h2></div><span>{lessons.length} bài học</span></div><p>Mở từng chương để xem mục tiêu bài học trước khi đăng ký.</p><div className="cd-curriculum">{modules.map((module, index) => <details key={module} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")} · {module}</span><small>{lessons.filter(item => String(item.module || "Bài học") === module).length} bài</small></summary>{lessons.filter(item => String(item.module || "Bài học") === module).map(item => <div className="cd-lesson" key={item._id.toString()}><Play size={16}/><div><strong>{item.title}</strong>{item.objective && <p>{item.objective}</p>}<small>{item.demo === true ? "Video demo · Minh họa trình phát" : "Cần quyền truy cập"}</small></div>{(enrolled || admin) && <Link href={`/courses/${encodeURIComponent(id)}/learn?lesson=${item._id}`}>Vào học ↗</Link>}</div>)}</details>)}</div>{!lessons.length && <p>Giáo trình đang được chuẩn bị. Chưa mở đăng ký.</p>}</section>
      <section className="cd-panel" id="requirements"><h2>Chuẩn bị trước khi học</h2>{prerequisites.length ? <ul>{prerequisites.map(item => <li key={item}>{item}</li>)}</ul> : <p>Máy tính, kết nối Internet và thời gian thực hành sau mỗi bài học.</p>}<div className="cd-mentor"><div><h3>Muốn có người đồng hành?</h3><p>Trao đổi mục tiêu để xây dựng lộ trình học 1:1 phù hợp với bạn.</p></div><Link href="/consultation">Tư vấn cùng mentor ↗</Link></div></section>
    </div><aside className="cd-enroll"><CourseIntro id={id} title={course.title} url={course.introVideoUrl}/><div className="cd-enroll-body"><span className="cd-eyebrow">HÀNH TRÌNH CỦA BẠN</span><h2>{enrolled ? "Bạn đã đăng ký" : "Bắt đầu từ bài học đầu tiên"}</h2><p>Thêm khóa học vào hành trình cá nhân và truy cập không gian học riêng.</p>{admin ? <Link className="cd-primary" href={`/courses/${id}/learn`}>Xem lớp học với quyền admin →</Link> : enrolled ? <Link className="cd-primary" href={`/courses/${id}/learn`}>Vào lớp học →</Link> : enrollment?.status === "revoked" ? <p role="alert">Đăng ký đã bị thu hồi. Vui lòng liên hệ hỗ trợ để khôi phục.</p> : !lessons.length ? <p>Khóa học sắp mở đăng ký.</p> : user ? <AcademyForm action={enrollCourse} label="Đăng ký học ngay"><input type="hidden" name="courseId" value={id}/></AcademyForm> : <CourseSignIn autoOpen={false}/>}<div className="cd-access-note"><ShieldCheck size={20}/><p>Đăng ký không thu phí và không tự mở khóa bài cần mã. Quyền xem bài chính thức được đội ngũ cấp riêng.</p></div><ul><li>✓ Giáo trình chia theo từng chương</li><li>✓ Mục tiêu & thực hành theo bài</li><li>✓ {demoCount} video demo đang có</li></ul><small>Video demo chỉ minh họa trình phát, không phải bài giảng chính thức. Chưa tích hợp thanh toán.</small></div></aside></div>
  </main>;
}
