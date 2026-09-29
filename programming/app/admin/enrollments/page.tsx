import Link from "next/link";
import { redirect } from "next/navigation";
import { getMongoDatabase } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import type { Enrollment } from "@/lib/enrollment";
import AcademyForm from "@/app/academy/form";
import { manageEnrollment } from "@/app/enrollment-actions";
import "@/app/academy.css";

export const dynamic = "force-dynamic";
export default async function EnrollmentAdmin({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  if (!await isAdminAuthenticated()) redirect("/admin");
  const params = await searchParams;
  const page = Math.max(1, Math.min(10000, Math.floor(Number(params.page) || 1)));
  const db = await getMongoDatabase();
  const [enrollments, total, courses] = await Promise.all([
    db.collection<Enrollment>("course_enrollments").find().sort({ enrolledAt: -1, _id: 1 }).skip((page - 1) * 30).limit(30).toArray(),
    db.collection("course_enrollments").countDocuments(),
    db.collection("courses").find({}, { projection: { id: 1, title: 1 } }).toArray(),
  ]);
  // Auth uses string user ids; join only these exact accounts, never demo learners.
  const { ObjectId } = await import("mongodb");
  const users = await db.collection("users").find({ _id: { $in: enrollments.map(item => item.userId).filter(ObjectId.isValid).map(id => new ObjectId(id)) } }, { projection: { name: 1, email: 1 } }).toArray();
  return <main className="academy academy-admin"><header><Link href="/admin">← Quản trị</Link><Link href="/admin/academy">Quản lý video & mã truy cập →</Link></header><h1>Đăng ký khóa học</h1><p>{total} lượt đăng ký từ tài khoản thật. Thu hồi enrollment chặn vào lớp học; khôi phục không tự cấp quyền video có mã.</p>{enrollments.length ? enrollments.map(item => {
    const user = users.find(user => user._id.toString() === item.userId);
    return <article className="academy-admin-row" key={item._id}><div><strong>{user?.name || "Tài khoản không còn tồn tại"}</strong><p>{user?.email || item.userId}</p><p>{courses.find(course => course.id === item.courseId)?.title || item.courseId} · {item.status === "active" ? "Đang đăng ký" : "Đã thu hồi"}</p><small>{item.enrolledAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</small></div><AcademyForm action={manageEnrollment} label={item.status === "active" ? "Thu hồi đăng ký" : "Khôi phục đăng ký"}><input type="hidden" name="id" value={item._id}/><input type="hidden" name="status" value={item.status === "active" ? "revoked" : "active"}/></AcademyForm></article>;
  }) : <p>Chưa có đăng ký ở trang này.</p>}<nav aria-label="Phân trang">{page > 1 && <Link href={`/admin/enrollments?page=${page - 1}`}>← Trang trước </Link>}<span>Trang {page}</span>{page * 30 < total && <Link href={`/admin/enrollments?page=${page + 1}`}> Trang sau →</Link>}</nav></main>;
}
