import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "Ngày báo cáo là bắt buộc." }, { status: 400 });

  try {
    const db = await getDatabase();
    const sessions = await db.collection("class_sessions").find({ date }).sort({ startTime: 1 }).toArray();
    const classIds = [...new Set(sessions.map((item) => item.classId).filter(Boolean))];
    const classes = await db.collection("course_classes").find({ _id: { $in: classIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id)) } }).toArray();
    const teacherIds = [...new Set(classes.map((item) => item.teacherId).filter(Boolean))];
    const teachers = await db.collection("teachers").find({ _id: { $in: teacherIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id)) } }).toArray();
    const classMap = new Map(classes.map((item) => [item._id.toString(), item]));
    const teacherMap = new Map(teachers.map((item) => [item._id.toString(), item]));
    const report = await db.collection("daily_reports").findOne({ date }, { projection: { _id: 0 } });

    return NextResponse.json({
      date,
      sessions: sessions.map(({ _id, ...session }) => {
        const classItem = classMap.get(String(session.classId));
        const teacher = classItem ? teacherMap.get(String(classItem.teacherId)) : undefined;
        return {
          id: _id.toString(),
          ...session,
          classCode: classItem?.code ?? "—",
          className: classItem?.name ?? "Lớp không xác định",
          teacherName: teacher?.name ?? "Chưa phân công",
        };
      }),
      report,
    });
  } catch (error) {
    console.error("Daily report GET error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Không thể tải báo cáo hằng ngày." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (!body.date || !body.summary) {
      return NextResponse.json({ error: "Ngày và nội dung tổng hợp là bắt buộc." }, { status: 400 });
    }
    const db = await getDatabase();
    await db.collection("daily_reports").updateOne(
      { date: body.date },
      { $set: {
        date: body.date,
        summary: body.summary,
        highlights: body.highlights ?? "",
        issues: body.issues ?? "",
        nextActions: body.nextActions ?? "",
        updatedAt: new Date(),
      }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
    return NextResponse.json({ message: "Đã lưu Daily Report." });
  } catch (error) {
    console.error("Daily report POST error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Không thể lưu Daily Report." }, { status: 500 });
  }
}
