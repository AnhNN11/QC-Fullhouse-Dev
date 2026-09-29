"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getMongoDatabase } from "@/lib/mongodb";
import { getSessionUser } from "@/lib/user-auth";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { enrollmentKey, type Enrollment } from "@/lib/enrollment";
import type { ActionState } from "./academy/actions";

export async function enrollCourse(_: ActionState, form: FormData): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "Vui lòng đăng nhập trước khi đăng ký khóa học." };
  const courseId = form.get("courseId");
  if (typeof courseId !== "string" || !courseId || courseId.length > 100) return { error: "Khóa học không hợp lệ." };
  const db = await getMongoDatabase();
  if (!await db.collection("courses").findOne({ id: courseId })) return { error: "Không tìm thấy khóa học." };
  if (!await db.collection("video_lessons").findOne({ courseId, published: true })) return { error: "Khóa học chưa mở đăng ký." };
  const collection = db.collection<Enrollment>("course_enrollments");
  const _id = enrollmentKey(user.id, courseId);
  // A deterministic primary key makes repeated/concurrent enrollment idempotent.
  try {
    await collection.updateOne({ _id }, { $setOnInsert: { courseId, userId: user.id, status: "active", enrolledAt: new Date() } }, { upsert: true });
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === 11000)) throw error;
  }
  if ((await collection.findOne({ _id }))?.status !== "active") return { error: "Đăng ký đã bị thu hồi. Vui lòng liên hệ đội ngũ hỗ trợ." };
  revalidatePath("/courses", "layout");
  revalidatePath("/admin/enrollments");
  redirect(`/courses/${encodeURIComponent(courseId)}/learn`);
}

export async function manageEnrollment(_: ActionState, form: FormData): Promise<ActionState> {
  if (!await isAdminAuthenticated()) return { error: "Không có quyền quản trị." };
  const id = form.get("id"), status = form.get("status");
  if (typeof id !== "string" || id.length > 300 || (status !== "active" && status !== "revoked")) return { error: "Dữ liệu không hợp lệ." };
  const db = await getMongoDatabase();
  const result = await db.collection<Enrollment>("course_enrollments").updateOne({ _id: id }, { $set: { status, updatedAt: new Date() } });
  if (!result.matchedCount) return { error: "Không tìm thấy đăng ký." };
  revalidatePath("/admin/enrollments");
  revalidatePath("/courses", "layout");
  return { success: status === "active" ? "Đã khôi phục đăng ký." : "Đã thu hồi đăng ký." };
}
