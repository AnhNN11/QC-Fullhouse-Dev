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
    const date = request.nextUrl.searchParams.get("date")?.trim() ?? "";
    const hasRecording = request.nextUrl.searchParams.get("hasRecording") === "true";
    const page = Math.max(1, Number.parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10) || 1);
    const pageSize = Math.min(50, Math.max(1, Number.parseInt(request.nextUrl.searchParams.get("pageSize") ?? "12", 10) || 12));
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Ngày phải có định dạng YYYY-MM-DD." }, { status: 400 });
    }

    const scopeQuery: Record<string, unknown> = { sourceSystem: "fullhousedev", sourceActive: { $ne: false } };
    if (date) scopeQuery.date = date;
    if (hasRecording) scopeQuery.recordingCount = { $gt: 0 };
    const query: Record<string, unknown> = { ...scopeQuery };

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
    const sort = date
      ? { startTime: 1, contestCode: 1, sessionNo: 1 }
      : { qcPriority: 1, date: -1, startTime: 1, contestCode: 1 };
    const [items, filteredTotal, total, waiting, reviewed, issues] = await Promise.all([
      db.collection("class_sessions").aggregate([
        { $match: query },
        { $set: {
          qcPriority: {
            $switch: {
              branches: [
                { case: { $eq: ["$recordingStatus", "issue"] }, then: 0 },
                { case: { $eq: ["$recordingStatus", "ready"] }, then: 1 },
                { case: { $eq: ["$recordingStatus", "reviewed"] }, then: 2 },
              ],
              default: 3,
            },
          },
        } },
        { $sort: sort },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
        { $project: {
          contestCode: 1,
          contestName: 1,
          teacherNames: 1,
          sessionNo: 1,
          date: 1,
          startTime: 1,
          endTime: 1,
          topic: 1,
          recordingUrl: 1,
          recordingCount: 1,
          recordingStatus: 1,
          qcScore: 1,
          qcNote: 1,
        } },
      ]).toArray(),
      db.collection("class_sessions").countDocuments(query),
      db.collection("class_sessions").countDocuments(scopeQuery),
      db.collection("class_sessions").countDocuments({ ...scopeQuery, recordingStatus: "ready" }),
      db.collection("class_sessions").countDocuments({ ...scopeQuery, recordingStatus: "reviewed" }),
      db.collection("class_sessions").countDocuments({ ...scopeQuery, recordingStatus: "issue" }),
    ]);

    return NextResponse.json({
      items: items.map(({ _id, ...item }) => ({ id: _id.toString(), ...item })),
      stats: { total, waiting, reviewed, issues },
      pagination: { page, pageSize, total: filteredTotal },
    });
  } catch (error) {
    console.error("QC sessions GET error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Không thể tải các buổi học đã crawl." }, { status: 500 });
  }
}
