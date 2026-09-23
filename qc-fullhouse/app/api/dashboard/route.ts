import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDatabase();
    const [teachers, allSessions, reviewedSessions, pendingSessions] = await Promise.all([
      db.collection("teachers").find(
        { managedBy: "qc-fullhouse", isPlaceholder: { $ne: true } },
        { projection: { managedBy: 0 } },
      ).sort({ order: 1 }).toArray(),
      db.collection("class_sessions").find(
        { sourceSystem: "fullhousedev", sourceActive: { $ne: false } },
        { projection: { teacherIds: 1 } },
      ).toArray(),
      db.collection("class_sessions").countDocuments({ sourceSystem: "fullhousedev", sourceActive: { $ne: false }, recordingStatus: "reviewed" }),
      db.collection("class_sessions").find({ sourceSystem: "fullhousedev", sourceActive: { $ne: false }, recordingStatus: { $in: ["ready", "issue"] } })
        .sort({ date: -1, startTime: 1 }).limit(3).toArray(),
    ]);

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
    const classCounts = allSessions.reduce((counts, item) => {
      const teacherIds = Array.isArray(item.teacherIds) ? item.teacherIds.map(String) : [];
      teacherIds.forEach((teacherId) => counts.set(teacherId, (counts.get(teacherId) ?? 0) + 1));
      return counts;
    }, new Map<string, number>());
    const dashboardTeachers = teachers.map(({ _id, ...teacher }) => ({
      ...teacher,
      classes: classCounts.get(_id.toString()) ?? 0,
    }));
    const pendingRecordings = pendingSessions.map((session, index) => {
      const date = String(session.date ?? "");
      return {
        day: date.slice(8, 10),
        month: `THG ${Number(date.slice(5, 7)) || "—"}`,
        title: `${session.contestName ?? session.contestCode ?? "Contest chưa xác định"} · Buổi ${session.sessionNo ?? "—"}`,
        teacher: Array.isArray(session.teacherNames) && session.teacherNames.length ? session.teacherNames.join(", ") : "Chưa phân công",
        time: `${session.startTime ?? "—"} – ${session.endTime ?? "—"}`,
        room: session.contestCode ?? "—",
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
