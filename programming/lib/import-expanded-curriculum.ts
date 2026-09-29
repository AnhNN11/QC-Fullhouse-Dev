import "server-only";
import { getMongoDatabase, getMongoClient } from "./mongodb";
import { expandedCurriculum } from "./expanded-curriculum";
import { encryptVideo } from "./video-security";
// Called only by an authenticated admin action or the explicit maintenance command.
export async function importExpandedCurriculum() {
  const db = await getMongoDatabase();
  const session = (await getMongoClient()).startSession();
  try {
    await session.withTransaction(async () => {
      for (const track of expandedCurriculum) {
        await db.collection("courses").updateOne({ id: track.course.id }, { $setOnInsert: { ...track.course, createdAt: new Date(), updatedAt: new Date() } }, { upsert: true, session });
        for (const [index, [title, objective, exercise]] of track.lessons.entries()) {
          const seedKey = `expansion-v1:${track.course.id}:${index}`;
          await db.collection("video_lessons").updateOne({ seedKey }, { $setOnInsert: { seedKey, courseId: track.course.id, title, module: track.course.modules[index], order: index + 1, objective, exercise, prerequisite: track.prerequisite, resource: track.resource, recordingOutline: `0–2 phút: đặt vấn đề bằng ví dụ thực tế.\n2–6 phút: ${objective}\n6–14 phút: làm mẫu: ${exercise}\n14–17 phút: cố ý tạo lỗi, đọc kết quả và sửa.\n17–20 phút: học viên tự làm, đối chiếu tiêu chí và tóm tắt.\nĐây là kế hoạch quay, không phải thời lượng video demo.`, encryptedVideo: encryptVideo("https://www.youtube.com/watch?v=M7lc1UVf-VE"), demo: true, published: true, createdAt: new Date() } }, { upsert: true, session });
        }
      }
    });
  } finally { await session.endSession(); }
  return { courses: expandedCurriculum.length, lessons: expandedCurriculum.reduce((sum, track) => sum + track.lessons.length, 0) };
}
