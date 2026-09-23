import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "Tháng phải có định dạng YYYY-MM." }, { status: 400 });
  }

  try {
    const db = await getDatabase();
    const sessions = await db.collection("class_sessions")
      .find({
        sourceSystem: "fullhousedev",
        sourceActive: { $ne: false },
        date: { $regex: `^${month}` },
        "teacherNames.0": { $exists: true },
        teacherNames: { $nin: ["Chưa phân công"] },
      })
      .sort({ date: 1, startTime: 1 })
      .toArray();

    return NextResponse.json({
      month,
      sessions: sessions.map(({ _id, ...session }) => ({
        id: _id.toString(),
        ...session,
        classCode: session.contestCode ?? "—",
        className: session.contestName ?? "Contest chưa xác định",
        room: "Fullhouse Online",
        teacherName: Array.isArray(session.teacherNames) && session.teacherNames.length ? session.teacherNames.join(", ") : "Chưa phân công",
        teacherInitials: Array.isArray(session.teacherNames) && session.teacherNames[0]
          ? String(session.teacherNames[0]).split(/\s+/).slice(-2).map((part) => part[0]).join("").toUpperCase()
          : "GV",
      })),
    });
  } catch (error) {
    console.error("Schedule GET error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Không thể tải lịch buổi học." }, { status: 500 });
  }
}
