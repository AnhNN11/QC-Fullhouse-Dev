import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

type ContestImportItem = {
  code?: unknown;
  name?: unknown;
  sourceAuthors?: unknown;
  startTime?: unknown;
  endTime?: unknown;
  sourceUrl?: unknown;
};

const UNASSIGNED_KEY = "contest-unassigned";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: ContestImportItem[] };
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 500) {
      return NextResponse.json({ error: "Danh sách import phải có từ 1 đến 500 contest." }, { status: 400 });
    }

    const db = await getDatabase();
    const teachers = await db.collection("teachers").find(
      { managedBy: "qc-fullhouse" },
      { projection: { key: 1 } },
    ).toArray();
    const teacherBySourceUsername = new Map(
      teachers.map((teacher) => [String(teacher.key ?? "").toLowerCase(), teacher._id.toString()]),
    );
    let unassignedTeacherId = teacherBySourceUsername.get(UNASSIGNED_KEY);
    let imported = 0;
    let assigned = 0;
    let unassigned = 0;

    for (const rawItem of body.items) {
      const code = String(rawItem.code ?? "").trim();
      const name = String(rawItem.name ?? "").trim();
      const startTime = String(rawItem.startTime ?? "").trim();
      const endTime = String(rawItem.endTime ?? "").trim();
      const sourceAuthors = Array.isArray(rawItem.sourceAuthors)
        ? rawItem.sourceAuthors.map(String).map((value) => value.trim()).filter(Boolean)
        : [];
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      if (!code || !name || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
        return NextResponse.json({ error: `Contest ${code || "không có mã"} có dữ liệu không hợp lệ.` }, { status: 400 });
      }

      const matchedTeacherIds = [...new Set(sourceAuthors
        .map((author) => teacherBySourceUsername.get(author.toLowerCase()))
        .filter((id): id is string => Boolean(id)))];
      let teacherIds = matchedTeacherIds;
      if (!teacherIds.length) {
        if (!unassignedTeacherId) {
          const result = await db.collection("teachers").insertOne({
            key: UNASSIGNED_KEY,
            code: "FHD-GV-000",
            name: "Chưa phân công",
            initials: "—",
            subject: "Contest chưa xác định giáo viên",
            email: "",
            phone: "",
            classes: 0,
            score: 0,
            trend: 0,
            status: "reviewing",
            managedBy: "qc-fullhouse",
            order: 999,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          unassignedTeacherId = result.insertedId.toString();
          teacherBySourceUsername.set(UNASSIGNED_KEY, unassignedTeacherId);
        }
        teacherIds = [unassignedTeacherId];
        unassigned += 1;
      } else {
        assigned += 1;
      }

      await db.collection("contests").updateOne(
        { code },
        {
          $set: {
            code,
            name,
            teacherIds,
            startTime,
            endTime,
            sourceUrl: String(rawItem.sourceUrl ?? "").trim(),
            sourceAuthors,
            notes: sourceAuthors.length ? `Tác giả trên FullHouseDev: ${sourceAuthors.join(", ")}` : "",
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true },
      );
      imported += 1;
    }

    await Promise.all([
      db.collection("contests").createIndex({ code: 1 }, { unique: true }),
      db.collection("contests").createIndex({ teacherIds: 1, endTime: 1 }),
    ]);

    return NextResponse.json({
      message: `Đã import ${imported} contest.`,
      imported,
      assigned,
      unassigned,
    });
  } catch (error) {
    console.error("Contest import error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Không thể import dữ liệu contest." }, { status: 500 });
  }
}
