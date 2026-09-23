import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search")?.trim().slice(0, 100) ?? "";
    const status = request.nextUrl.searchParams.get("status")?.trim() ?? "all";
    const query: Record<string, unknown> = { sourceSystem: "fullhousedev" };

    if (["pending_upload", "ready", "reviewed", "issue"].includes(status)) {
      query.recordingStatus = status;
    }
    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = ["contestCode", "contestName", "topic", "teacherNames"].map((field) => ({
        [field]: { $regex: safeSearch, $options: "i" },
      }));
    }

    const db = await getDatabase();
    const [items, total, waiting, reviewed, issues] = await Promise.all([
      db.collection("class_sessions").find(query).sort({ date: -1, startTime: 1, contestCode: 1 }).limit(500).toArray(),
      db.collection("class_sessions").countDocuments({ sourceSystem: "fullhousedev" }),
      db.collection("class_sessions").countDocuments({ sourceSystem: "fullhousedev", recordingStatus: "ready" }),
      db.collection("class_sessions").countDocuments({ sourceSystem: "fullhousedev", recordingStatus: "reviewed" }),
      db.collection("class_sessions").countDocuments({ sourceSystem: "fullhousedev", recordingStatus: "issue" }),
    ]);

    return NextResponse.json({
      items: items.map(({ _id, ...item }) => ({ id: _id.toString(), ...item })),
      stats: { total, waiting, reviewed, issues },
    });
  } catch (error) {
    console.error("QC sessions GET error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Không thể tải các buổi học đã crawl." }, { status: 500 });
  }
}
