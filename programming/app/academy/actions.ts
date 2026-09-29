"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getMongoDatabase } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSessionUser } from "@/lib/user-auth";
import { encryptVideo, hashAccess } from "@/lib/video-security";
import { parseLessonFields, lessonPublishError } from "@/lib/lesson-editor";
import { ObjectId } from "mongodb";

export type ActionState = { error?: string; success?: string; accessCode?: string };
function field(form: FormData, name: string, max = 500) {
  const value = String(form.get(name) ?? "").trim();
  if (!value || value.length > max) throw new Error(`Vui lòng kiểm tra trường ${name}.`);
  return value;
}

export async function requestConsultation(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const name = field(form, "name", 100);
    const contact = field(form, "contact", 150);
    const goal = field(form, "goal", 2000);
    const availability = field(form, "availability", 300);
    if (form.get("consent") !== "on") return { error: "Vui lòng đồng ý để đội ngũ liên hệ tư vấn." };
    if (form.get("website")) return { success: "Đã nhận yêu cầu." };
    const db = await getMongoDatabase();
    const recent = await db.collection("consultations").countDocuments({ contact, createdAt: { $gt: new Date(Date.now() - 600_000) } });
    if (recent) return { error: "Đã nhận yêu cầu của bạn. Vui lòng chờ đội ngũ liên hệ." };
    await db.collection("consultations").insertOne({ name, contact, goal, availability, status: "new", notes: "", createdAt: new Date() });
    return { success: "Đã nhận yêu cầu! Đội ngũ sẽ liên hệ để tìm hiểu mục tiêu và thống nhất lịch tư vấn." };
  } catch { return { error: "Chưa gửi được yêu cầu. Kiểm tra thông tin hoặc thử lại sau." }; }
}

export async function manageAcademy(_: ActionState, form: FormData): Promise<ActionState> {
  if (!await isAdminAuthenticated()) return { error: "Vui lòng đăng nhập admin." };
  try {
    const db = await getMongoDatabase();
    const action = field(form, "action");
    if (action === "lesson") {
      const courseId = field(form, "courseId");
      if (!await db.collection("courses").findOne({ id: courseId })) throw new Error("Khóa học không tồn tại.");
      const values = parseLessonFields(form, true);
      const video = String(form.get("video") ?? "").trim();
      const encryptedVideo = video ? encryptVideo(video) : undefined;
      const published = form.get("published") === "on";
      if(published) { const issue=lessonPublishError({...values,encryptedVideo}); if(issue) throw new Error(issue); }
      await db.collection("video_lessons").insertOne({ courseId, ...values, ...(encryptedVideo ? {encryptedVideo} : {}), published, createdAt: new Date(), updatedAt:new Date() });
    } else if (action === "editLesson") {
      const id = new ObjectId(field(form, "id"));
      const existing = await db.collection('video_lessons').findOne({_id:id});
      if(!existing || !await db.collection('courses').findOne({id:existing.courseId})) throw new Error('Bài giảng hoặc khóa học không còn tồn tại.');
      const video = String(form.get('video') ?? '').trim();
      const update: Record<string, unknown> = {...parseLessonFields(form),updatedAt:new Date()};
      if (video) update.encryptedVideo = encryptVideo(video);
      if(existing.published) {const issue=lessonPublishError({encryptedVideo:update.encryptedVideo??existing.encryptedVideo,objective:update.objective??existing.objective,exercise:update.exercise??existing.exercise});if(issue)throw new Error(issue);}
      const result=await db.collection('video_lessons').updateOne({ _id: id }, { $set: update });
      if(!result.matchedCount) throw new Error('Bài giảng đã bị xóa. Tải lại trang để tiếp tục.');
    } else if (action === "publish") {
      const id=new ObjectId(field(form, "id"));
      const lesson=await db.collection('video_lessons').findOne({_id:id});
      if(!lesson || !await db.collection('courses').findOne({id:lesson.courseId})) throw new Error('Bài giảng hoặc khóa học không còn tồn tại.');
      const published=form.get('published')==='true';
      if(published){const issue=lessonPublishError({encryptedVideo:lesson.encryptedVideo,objective:lesson.objective,exercise:lesson.exercise});if(issue)throw new Error(issue);}
      await db.collection("video_lessons").updateOne({ _id:id }, { $set: { published,updatedAt:new Date() } });
    } else if (action === "consultation") {
      const status = field(form, "status");
      if (!["new", "contacted", "scheduled", "enrolled", "closed"].includes(status)) throw new Error("Trạng thái không hợp lệ.");
      await db.collection("consultations").updateOne({ _id: new ObjectId(field(form, "id")) }, { $set: { status, notes: String(form.get("notes") ?? "").slice(0, 3000) } });
    } else if (action === "grant") {
      const courseId = field(form, "courseId");
      if (!await db.collection("courses").findOne({ id: courseId })) throw new Error("Khóa học không tồn tại.");
      const accessCode = randomBytes(24).toString("base64url");
      await db.collection("course_access").insertOne({ courseId, learner: field(form, "learner", 150), tokenHash: hashAccess(accessCode), expiresAt: new Date(Date.now() + 90 * 86400_000), revoked: false });
      revalidatePath("/admin/academy");
      return { success: "Đã cấp quyền 90 ngày. Sao chép mã này gửi riêng cho học viên; mã chỉ hiện một lần.", accessCode };
    } else if (action === "revoke") {
      await db.collection("course_access").updateOne({ _id: new ObjectId(field(form, "id")) }, { $set: { revoked: true } });
    } else throw new Error("Thao tác không hợp lệ.");
    revalidatePath("/admin/academy");
    revalidatePath("/admin/courses/[id]", "page");
    revalidatePath("/courses/[id]", "page");
    revalidatePath("/courses/[id]/learn", "page");
    revalidatePath("/courses");
    return { success: "Đã lưu thay đổi." };
  } catch (error) { return { error: error instanceof Error && !error.message.includes("auth") ? error.message : "Chưa thể lưu dữ liệu." }; }
}

export async function unlockCourse(_: ActionState, form: FormData): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "Vui lòng đăng nhập tài khoản học viên trước khi mở khóa học." };
  try {
    const code = field(form, "code", 100);
    const courseId = field(form, "courseId");
    const db = await getMongoDatabase();
    const grant = await db.collection("course_access").findOneAndUpdate(
      { courseId, tokenHash: hashAccess(code), revoked: false, expiresAt: { $gt: new Date() }, $or: [{ learnerUserId: user.id }, { learnerUserId: { $exists: false } }] },
      { $set: { learnerUserId: user.id } }, { returnDocument: "after" },
    );
    if (!grant) return { error: "Mã không hợp lệ, đã hết hạn hoặc đã bị thu hồi." };
    (await cookies()).set(`course_${courseId}`, code, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 86400 });
    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}/learn`);
    return { success: "Đã mở khóa học." };
  } catch { return { error: "Chưa thể xác thực quyền học. Vui lòng thử lại." }; }
}
