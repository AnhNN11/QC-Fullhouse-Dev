import { ObjectId } from "mongodb";
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
      .find({ date: { $regex: `^${month}` } })
      .sort({ date: 1, startTime: 1 })
      .toArray();
    const classIds = [...new Set(sessions.map((item) => String(item.classId)).filter(ObjectId.isValid))];
    const classes = await db.collection("course_classes")
      .find({ _id: { $in: classIds.map((id) => new ObjectId(id)) } })
      .toArray();
    const teacherIds = [...new Set(classes.map((item) => String(item.teacherId)).filter(ObjectId.isValid))];
    const teachers = await db.collection("teachers")
      .find({ _id: { $in: teacherIds.map((id) => new ObjectId(id)) } })
      .toArray();
    const classMap = new Map(classes.map((item) => [item._id.toString(), item]));
    const teacherMap = new Map(teachers.map((item) => [item._id.toString(), item]));

    return NextResponse.json({
      month,
      sessions: sessions.map(({ _id, ...session }) => {
        const classItem = classMap.get(String(session.classId));
        const teacher = classItem ? teacherMap.get(String(classItem.teacherId)) : undefined;
        return {
          id: _id.toString(),
          ...session,
          classCode: classItem?.code ?? "—",
          className: classItem?.name ?? "Lớp không xác định",
          room: classItem?.room ?? "—",
          teacherName: teacher?.name ?? "Chưa phân công",
          teacherInitials: teacher?.initials ?? "GV",
        };
      }),
    });
  } catch (error) {
    console.error("Schedule GET error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Không thể tải lịch buổi học." }, { status: 500 });
  }
}
