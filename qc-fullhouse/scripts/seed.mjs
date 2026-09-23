import nextEnv from "@next/env";
import { MongoClient, ServerApiVersion } from "mongodb";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB ?? "fullhouse_qc";

if (!uri) throw new Error("MONGODB_URI chưa được cấu hình.");

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

const dashboardId = "qc-fullhouse";

try {
  await client.connect();
  const db = client.db(databaseName);

  const teachers = [
    { key: "gv-001", code: "GV-001", name: "Nguyễn Minh Anh", initials: "NA", subject: "Tiếng Anh nền tảng", email: "minhanh@fullhouse.edu.vn", phone: "0901 234 567", classes: 6, score: 92, trend: 3.2, status: "active", order: 1 },
    { key: "gv-002", code: "GV-002", name: "Trần Hoàng Nam", initials: "TN", subject: "IELTS", email: "hoangnam@fullhouse.edu.vn", phone: "0902 345 678", classes: 5, score: 88, trend: 1.4, status: "active", order: 2 },
    { key: "gv-003", code: "GV-003", name: "Lê Thu Trang", initials: "LT", subject: "Tiếng Anh giao tiếp", email: "thutrang@fullhouse.edu.vn", phone: "0903 456 789", classes: 4, score: 79, trend: -2.1, status: "warning", order: 3 },
    { key: "gv-004", code: "GV-004", name: "Phạm Gia Huy", initials: "PH", subject: "Tiếng Anh thiếu nhi", email: "giahuy@fullhouse.edu.vn", phone: "0904 567 890", classes: 5, score: 86, trend: 0.8, status: "reviewing", order: 4 },
  ];
  await Promise.all(teachers.map((item) => db.collection("teachers").updateOne(
    { managedBy: dashboardId, key: item.key }, { $set: { managedBy: dashboardId, ...item } }, { upsert: true },
  )));

  const courses = [
    { code: "KH-EF1", name: "English Foundation 1", level: "Foundation", durationWeeks: 12, description: "Xây dựng nền tảng từ vựng và ngữ pháp căn bản.", status: "active" },
    { code: "KH-IELTS", name: "IELTS Intensive 6.5+", level: "IELTS", durationWeeks: 16, description: "Luyện thi IELTS chuyên sâu mục tiêu 6.5 trở lên.", status: "active" },
    { code: "KH-JUNIOR", name: "Junior Communication", level: "Junior", durationWeeks: 10, description: "Giao tiếp tiếng Anh dành cho học viên nhỏ tuổi.", status: "active" },
  ];
  for (const item of courses) {
    await db.collection("courses").updateOne(
      { code: item.code },
      { $set: { ...item, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
  }

  const [foundationCourse, ieltsCourse, juniorCourse, minhAnh, hoangNam, thuTrang, giaHuy] = await Promise.all([
    db.collection("courses").findOne({ code: "KH-EF1" }),
    db.collection("courses").findOne({ code: "KH-IELTS" }),
    db.collection("courses").findOne({ code: "KH-JUNIOR" }),
    db.collection("teachers").findOne({ key: "gv-001" }),
    db.collection("teachers").findOne({ key: "gv-002" }),
    db.collection("teachers").findOne({ key: "gv-003" }),
    db.collection("teachers").findOne({ key: "gv-004" }),
  ]);
  const classSeeds = [
    { code: "FH-EF1-0426", name: "English Foundation 1 · K04", courseId: foundationCourse._id.toString(), teacherId: minhAnh._id.toString(), startDate: "2026-09-08", schedule: "Thứ 2, 4 · 18:00–19:30", room: "Phòng 302", studentCount: 14, status: "active" },
    { code: "FH-IELTS-0916", name: "IELTS Intensive · K09", courseId: ieltsCourse._id.toString(), teacherId: hoangNam._id.toString(), startDate: "2026-09-12", schedule: "Thứ 3, 7 · 09:00–11:00", room: "Phòng 401", studentCount: 12, status: "active" },
    { code: "FH-EF2-0326", name: "English Foundation 2 · K03", courseId: foundationCourse._id.toString(), teacherId: thuTrang._id.toString(), startDate: "2026-09-05", schedule: "Thứ 3, 5 · 18:00–19:30", room: "Phòng 305", studentCount: 16, status: "active" },
    { code: "FH-JC-0826", name: "Junior Communication · K08", courseId: juniorCourse._id.toString(), teacherId: giaHuy._id.toString(), startDate: "2026-09-01", schedule: "Thứ 3, 5 · 17:30–19:00", room: "Phòng 204", studentCount: 15, status: "active" },
  ];
  for (const item of classSeeds) {
    await db.collection("course_classes").updateOne(
      { code: item.code },
      { $set: { ...item, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
  }

  const [foundationClass, ieltsClass, foundationTwoClass, juniorClass] = await Promise.all([
    db.collection("course_classes").findOne({ code: "FH-EF1-0426" }),
    db.collection("course_classes").findOne({ code: "FH-IELTS-0916" }),
    db.collection("course_classes").findOne({ code: "FH-EF2-0326" }),
    db.collection("course_classes").findOne({ code: "FH-JC-0826" }),
  ]);
  const sessionSeeds = [
    { classId: foundationClass._id.toString(), sessionNo: 1, date: "2026-09-08", startTime: "18:00", endTime: "19:30", topic: "Course orientation & placement review", note: "", status: "completed", recordingUrl: "", recordingStatus: "reviewed", qcNote: "Đã kiểm tra, chất lượng tốt." },
    { classId: foundationClass._id.toString(), sessionNo: 2, date: "2026-09-10", startTime: "18:00", endTime: "19:30", topic: "Present simple & daily routines", note: "", status: "completed", recordingUrl: "", recordingStatus: "ready", qcNote: "" },
    { classId: foundationClass._id.toString(), sessionNo: 3, date: "2026-09-15", startTime: "18:00", endTime: "19:30", topic: "Vocabulary: Family and relationships", note: "", status: "scheduled", recordingUrl: "", recordingStatus: "pending_upload", qcNote: "" },
    { classId: foundationClass._id.toString(), sessionNo: 6, date: "2026-09-22", startTime: "18:00", endTime: "19:30", topic: "Listening strategies & practice", note: "", status: "completed", recordingUrl: "", recordingStatus: "ready", qcNote: "" },
    { classId: ieltsClass._id.toString(), sessionNo: 8, date: "2026-09-22", startTime: "09:00", endTime: "11:00", topic: "Writing Task 2: Opinion essays", note: "", status: "completed", recordingUrl: "", recordingStatus: "reviewed", qcNote: "Giáo viên triển khai bài rõ ràng, tương tác tốt." },
    { classId: foundationTwoClass._id.toString(), sessionNo: 5, date: "2026-09-22", startTime: "18:00", endTime: "19:30", topic: "Past simple & storytelling", note: "", status: "completed", recordingUrl: "", recordingStatus: "ready", qcNote: "" },
    { classId: juniorClass._id.toString(), sessionNo: 7, date: "2026-09-22", startTime: "17:30", endTime: "19:00", topic: "Speaking: My favourite activities", note: "", status: "completed", recordingUrl: "", recordingStatus: "issue", qcNote: "Âm thanh record bị nhỏ trong 10 phút đầu." },
    { classId: foundationClass._id.toString(), sessionNo: 7, date: "2026-09-24", startTime: "18:00", endTime: "19:30", topic: "Reading comprehension", note: "", status: "scheduled", recordingUrl: "", recordingStatus: "pending_upload", qcNote: "" },
    { classId: foundationTwoClass._id.toString(), sessionNo: 6, date: "2026-09-24", startTime: "19:45", endTime: "21:15", topic: "Pronunciation workshop", note: "", status: "scheduled", recordingUrl: "", recordingStatus: "pending_upload", qcNote: "" },
  ];
  for (const item of sessionSeeds) {
    await db.collection("class_sessions").updateOne(
      { classId: item.classId, sessionNo: item.sessionNo },
      { $set: { ...item, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
  }

  await db.collection("daily_reports").updateOne(
    { date: "2026-09-22" },
    { $set: {
      date: "2026-09-22",
      summary: "Ngày 22/09/2026 có 4 buổi học. QC đã kiểm tra 1/4 record, còn 2 record chờ kiểm tra và 1 record có vấn đề.",
      highlights: "IELTS Intensive: giáo viên triển khai bài rõ ràng, tương tác tốt.",
      issues: "Junior Communication: âm thanh record bị nhỏ trong 10 phút đầu.",
      nextActions: "Kiểm tra 2 record còn lại và phản hồi bộ phận vận hành về chất lượng âm thanh.",
      updatedAt: new Date(),
    }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true },
  );

  await Promise.all([
    db.collection("teachers").createIndex({ managedBy: 1, key: 1 }, { unique: true }),
    db.collection("qc_evaluations").createIndex({ teacherId: 1, createdAt: -1 }),
    db.collection("qc_evaluations").createIndex({ sessionId: 1 }, { unique: true, sparse: true }),
    db.collection("courses").createIndex({ code: 1 }, { unique: true }),
    db.collection("course_classes").createIndex({ code: 1 }, { unique: true }),
    db.collection("class_sessions").createIndex({ classId: 1, sessionNo: 1 }, { unique: true }),
    db.collection("contests").createIndex({ code: 1 }, { unique: true }),
    db.collection("contests").createIndex({ teacherId: 1, endTime: 1 }),
  ]);

  console.log("Đã kết nối MongoDB và khởi tạo dữ liệu Fullhouse QC thành công.");
} finally {
  await client.close();
}
