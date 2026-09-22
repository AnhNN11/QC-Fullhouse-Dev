import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDatabase();
    const [teachers, allClasses, reviewedSessions, pendingSessions] = await Promise.all([
      db.collection("teachers").find(
        { managedBy: "qc-fullhouse" },
        { projection: { managedBy: 0 } },
      ).sort({ order: 1 }).toArray(),
      db.collection("course_classes").find({}, { projection: { teacherId: 1 } }).toArray(),
      db.collection("class_sessions").countDocuments({ recordingStatus: "reviewed" }),
      db.collection("class_sessions").find({ recordingStatus: { $in: ["ready", "issue"] } })
        .sort({ date: -1, startTime: 1 }).limit(3).toArray(),
    ]);

    const classIds = [...new Set(pendingSessions.map((item) => String(item.classId)).filter(ObjectId.isValid))];
    const classes = await db.collection("course_classes").find({
      _id: { $in: classIds.map((id) => new ObjectId(id)) },
    }).toArray();
    const teacherIds = [...new Set(classes.map((item) => String(item.teacherId)).filter(ObjectId.isValid))];
    const relatedTeachers = await db.collection("teachers").find({
      _id: { $in: teacherIds.map((id) => new ObjectId(id)) },
    }).toArray();
    const classMap = new Map(classes.map((item) => [item._id.toString(), item]));
    const teacherMap = new Map(relatedTeachers.map((item) => [item._id.toString(), item]));
    const scores = teachers.map((item) => Number(item.score)).filter((score) => Number.isFinite(score) && score > 0);
    const averageScore = scores.length
      ? Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10
      : 0;
    const stats = {
      totalTeachers: teachers.length,
      averageScore,
      evaluatedSessions: reviewedSessions,
      attentionNeeded: teachers.filter((item) => ["warning", "reviewing"].includes(String(item.status))).length,
    };
    const classCounts = allClasses.reduce((counts, item) => {
      const teacherId = String(item.teacherId ?? "");
      counts.set(teacherId, (counts.get(teacherId) ?? 0) + 1);
      return counts;
    }, new Map<string, number>());
    const dashboardTeachers = teachers.map(({ _id, ...teacher }) => ({
      ...teacher,
      classes: classCounts.get(_id.toString()) ?? 0,
    }));
    const pendingRecordings = pendingSessions.map((session, index) => {
      const classItem = classMap.get(String(session.classId));
      const teacher = classItem ? teacherMap.get(String(classItem.teacherId)) : undefined;
      const date = String(session.date ?? "");
      return {
        day: date.slice(8, 10),
        month: `THG ${Number(date.slice(5, 7)) || "—"}`,
        title: `${classItem?.name ?? "Lớp không xác định"} · Buổi ${session.sessionNo ?? "—"}`,
        teacher: teacher?.name ?? "Chưa phân công",
        time: `${session.startTime ?? "—"} – ${session.endTime ?? "—"}`,
        room: classItem?.room ?? "—",
        color: index === 0 ? "blue" : index === 1 ? "orange" : "purple",
        reviewStatus: session.recordingStatus === "issue" ? "Record có vấn đề" : "Chờ kiểm tra",
      };
    });

    return NextResponse.json({
      tip: stats.attentionNeeded
        ? `${stats.attentionNeeded} giáo viên đang cần theo dõi hoặc hỗ trợ. Hãy ưu tiên xem record và coaching trong tuần này.`
        : "Đội ngũ hiện không có giáo viên thuộc nhóm cần ưu tiên hỗ trợ.",
      stats,
      teachers: dashboardTeachers,
      pendingRecordings,
    });
  } catch (error) {
    console.error("MongoDB dashboard error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Không thể tải dữ liệu từ MongoDB." },
      { status: 500 },
    );
  }
}
