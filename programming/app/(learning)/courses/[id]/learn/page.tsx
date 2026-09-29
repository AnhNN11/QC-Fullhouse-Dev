import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import LessonCompletion from "@/app/lesson-completion";
import { calculateProgress } from "@/lib/course-progress";
import { getMongoDatabase } from "@/lib/mongodb";
import { decryptVideo } from "@/lib/video-security";
import { enrollmentKey, type Enrollment } from "@/lib/enrollment";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSessionUser } from "@/lib/user-auth";
import AcademyForm from "@/app/academy/form";
import { unlockCourse } from "@/app/academy/actions";
import "@/app/academy.css";
import "@/app/landing-polish.css";

export const dynamic = "force-dynamic";
export default async function CoursePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ lesson?: string | string[] }> }) {
  const { id } = await params;
  const { lesson } = await searchParams;
  const db = await getMongoDatabase();
  const course = await db.collection("courses").findOne({ id });
  if (!course) notFound();
  const lessons = await db.collection("video_lessons").find({ courseId: id, published: true }, { projection: { encryptedVideo: 0 } }).sort({ order: 1, _id: 1 }).toArray();
  const user = await getSessionUser();
  const completed = user ? await db.collection("lesson_progress").find({ learnerId: user.id, courseId: id, completed: true }).toArray() : [];
  const completedIds = new Set(completed.map(item => item.lessonId as string));
  const selected = lesson === undefined ? (lessons.find(item => !completedIds.has(item._id.toString())) ?? lessons[0]) : lessons.find(item => item._id.toString() === lesson);
  if (lesson !== undefined && !selected) notFound();
  const admin = await isAdminAuthenticated();
  const enrollment = user ? await db.collection<Enrollment>("course_enrollments").findOne({ _id: enrollmentKey(user.id, id), status: "active" }) : null;
  if (!admin && !enrollment) redirect(`/courses/${encodeURIComponent(id)}`);
  const allowed = admin || Boolean(user && await db.collection("course_access").findOne({ courseId: id, learnerUserId: user.id, revoked: false, expiresAt: { $gt: new Date() } }));
  let videoId: string | undefined;
  if ((allowed || selected?.demo === true) && selected) {
    const fullLesson = await db.collection("video_lessons").findOne({ _id: selected._id, published: true, courseId: id });
    if (fullLesson) videoId = decryptVideo(fullLesson.encryptedVideo);
  }
  return <main className="academy"><nav className="lesson-breadcrumb"><Link href={`/courses/${id}`}>← Giới thiệu khóa học</Link><Link href="/consultation">Cần mentor đồng hành?</Link></nav><section className="lesson-heading"><span>{course.level}</span><h1>{course.title}</h1><p>{course.description}</p>{id === "scratch-blocks" && <Link className="academy-button" href="/resources/blocks">Mở phòng thực hành kéo thả →</Link>}</section><section className="lesson-grid"><article><div className="lesson-player">{videoId ? <iframe title={selected?.title} src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <div><span>▷</span><h2>{allowed ? "Bài giảng đang được cập nhật" : "Không gian học dành cho bạn"}</h2><p>{allowed ? "Quay lại khi có bài học mới." : "Nhập mã được đội ngũ cấp để bắt đầu học."}</p></div>}</div><h2>{selected?.title ?? "Nội dung khóa học"}</h2>{selected?.demo && <p role="note">VIDEO DEMO kiểm tra trình phát — không phải bài giảng của khóa. Video chính thức sẽ được quay theo giáo án bên dưới.</p>}{selected && (allowed || selected.demo === true) && <section className="lesson-notes">{user && <LessonCompletion key={selected._id.toString()} courseId={id} lessonId={selected._id.toString()} completed={completedIds.has(selected._id.toString())}/>}<h3>Trước khi học</h3><p>{selected.prerequisite}</p><h3>Mục tiêu</h3><p>{selected.objective}</p><h3>Thực hành & tiêu chí hoàn thành</h3><p>{selected.exercise}</p>{selected.resource && <p><a href={selected.resource} target="_blank" rel="noopener noreferrer">Đọc tài liệu chính thức ↗</a></p>}<details><summary>Giáo án / kế hoạch quay</summary><p style={{whiteSpace:'pre-line'}}>{selected.recordingOutline}</p></details></section>}{!allowed && !selected?.demo && <AcademyForm action={unlockCourse} label="Mở khóa học"><input type="hidden" name="courseId" value={id}/><label>Mã truy cập<input name="code" required autoComplete="off" maxLength={100}/></label></AcademyForm>}</article><aside><h2>Chương trình học</h2><p>{calculateProgress(lessons.map(item => item._id.toString()), [...completedIds])}% hoàn thành · Tự đánh giá</p>{lessons.length ? lessons.map((item, index) => <Link className={selected?._id.equals(item._id) ? "selected" : ""} key={item._id.toString()} href={`/courses/${id}/learn?lesson=${item._id}`}><small>{completedIds.has(item._id.toString()) ? "✓ Hoàn thành · " : ""}{item.module}</small><strong>{String(index + 1).padStart(2, "0")} · {item.title}</strong><span>{item.demo ? "▷ Demo + giáo án" : allowed ? "▷ Xem bài học" : "Chưa mở khóa"}</span></Link>) : <p>Chưa có bài giảng được xuất bản.</p>}</aside></section></main>;
}
