import Link from "next/link";
import "./enrollments.css";
import { getSessionUser } from "@/lib/user-auth";
import { getMongoDatabase } from "@/lib/mongodb";
import type { Enrollment } from "@/lib/enrollment";
import { calculateProgress } from "@/lib/course-progress";

export default async function MyEnrollments() {
  const user = await getSessionUser();
  if (!user) return null;
  const db = await getMongoDatabase();
  const enrollments = await db.collection<Enrollment>("course_enrollments").find({ userId: user.id, status: "active" }).sort({ enrolledAt: -1 }).toArray();
  if (!enrollments.length) return null;
  const courses = await db.collection("courses").find({ id: { $in: enrollments.map(item => item.courseId) } }, { projection: { id: 1, title: 1 } }).toArray();
  const courseIds = courses.map(course => course.id);
  const [lessons, completions] = await Promise.all([
    db.collection("video_lessons").find({ courseId: { $in: courseIds }, published: true }, { projection: { courseId: 1 } }).toArray(),
    db.collection("lesson_progress").find({ learnerId: user.id, courseId: { $in: courseIds }, completed: true }).toArray(),
  ]);
  return <section className="my-enrollments"><h2>Khóa học đã đăng ký</h2><div>{courses.map(course => {
    const progress = calculateProgress(lessons.filter(item => item.courseId === course.id).map(item => item._id.toString()), completions.filter(item => item.courseId === course.id).map(item => item.lessonId));
    return <Link key={course.id} href={`/courses/${encodeURIComponent(course.id)}/learn`}><strong>{course.title}</strong><span>{progress}% hoàn thành · {progress === 100 ? "Ôn tập" : "Tiếp tục học"} →</span></Link>;
  })}</div></section>;
}
