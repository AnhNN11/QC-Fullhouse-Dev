import "server-only";
import { ObjectId } from "mongodb";
import { getMongoDatabase } from "./mongodb";
import { getSessionUser } from "./user-auth";
import { enrollmentKey, type Enrollment } from "./enrollment";
import { recordActivity } from "./record-activity";
export type LessonProgress = { _id: string; learnerId: string; courseId: string; lessonId: string; completed: boolean; updatedAt: Date };
export async function completeLesson(courseId: string, lessonId: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("Vui lòng đăng nhập.");
  if (!ObjectId.isValid(lessonId)) throw new Error("Bài học không hợp lệ.");
  const db = await getMongoDatabase();
  const course = await db.collection("courses").findOne({ id: courseId });
  const enrollment = await db.collection<Enrollment>("course_enrollments").findOne({ _id: enrollmentKey(user.id, courseId), status: "active" });
  const lesson = await db.collection("video_lessons").findOne({ _id: new ObjectId(lessonId), courseId, published: true });
  if (!course || !enrollment || !lesson) throw new Error("Bạn chưa đăng ký hoặc bài học không còn được xuất bản.");
  if (!lesson.demo && !await db.collection("course_access").findOne({ courseId, learnerUserId: user.id, revoked: false, expiresAt: { $gt: new Date() } })) throw new Error("Bạn chưa có quyền truy cập bài học này.");
  await db.collection<LessonProgress>("lesson_progress").updateOne({ _id: JSON.stringify([user.id, courseId, lessonId]) }, { $set: { learnerId: user.id, courseId, lessonId, completed: true, updatedAt: new Date() } }, { upsert: true });
  await recordActivity(user.id);
}
export function calculateProgress(publishedIds: string[], completedIds: string[]) {
  const completed = new Set(completedIds);
  return publishedIds.length ? Math.round(publishedIds.filter(id => completed.has(id)).length / publishedIds.length * 100) : 0;
}
