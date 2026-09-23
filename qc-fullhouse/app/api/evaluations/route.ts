import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

type EvaluationPayload = {
  sessionId?: string;
  score?: number;
  note?: string;
  outcome?: "reviewed" | "issue";
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EvaluationPayload;
    const sessionId = body.sessionId?.trim();
    const note = body.note?.trim() ?? "";
    const score = Number(body.score);
    const outcome = body.outcome === "issue" ? "issue" : "reviewed";

    if (!sessionId || !ObjectId.isValid(sessionId) || !Number.isFinite(score) || score < 0 || score > 100) {
      return NextResponse.json(
        { error: "Buổi học hợp lệ và điểm từ 0 đến 100 là bắt buộc." },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const lesson = await db.collection("class_sessions").findOne({ _id: new ObjectId(sessionId) });
    if (!lesson) return NextResponse.json({ error: "Không tìm thấy buổi học." }, { status: 404 });
    if (lesson.sourceSystem !== "fullhousedev") {
      return NextResponse.json({ error: "Buổi học này không thuộc dữ liệu crawl Fullhouse." }, { status: 409 });
    }

    const now = new Date();
    const result = await db.collection("qc_evaluations").updateOne(
      { sessionId },
      { $set: {
        sessionId,
        teacherIds: Array.isArray(lesson.teacherIds) ? lesson.teacherIds : [],
        teacherNames: Array.isArray(lesson.teacherNames) ? lesson.teacherNames : [],
        contestId: String(lesson.contestId ?? ""),
        contestCode: String(lesson.contestCode ?? ""),
        sourceSessionId: String(lesson.sourceSessionId ?? ""),
        evaluatorRole: "QC",
        score,
        outcome,
        note,
        updatedAt: now,
      }, $setOnInsert: { createdAt: now } },
      { upsert: true },
    );
    await db.collection("class_sessions").updateOne(
      { _id: lesson._id },
      { $set: { recordingStatus: outcome, qcScore: score, qcNote: note, qcReviewedAt: now, updatedAt: now } },
    );
    const teacherIds = Array.isArray(lesson.teacherIds)
      ? lesson.teacherIds.map(String).filter(ObjectId.isValid)
      : [];
    await Promise.all(teacherIds.map(async (teacherId) => {
      const [summary] = await db.collection("qc_evaluations").aggregate([
        { $match: { teacherIds: teacherId } },
        { $group: { _id: null, average: { $avg: "$score" } } },
      ]).toArray();
      if (summary?.average !== undefined) {
        await db.collection("teachers").updateOne(
          { _id: new ObjectId(teacherId) },
          { $set: { score: Math.round(Number(summary.average) * 10) / 10, updatedAt: now } },
        );
      }
    }));

    return NextResponse.json(
      { id: result.upsertedId?.toString() ?? sessionId, message: "Đã lưu phiếu đánh giá và cập nhật trạng thái record." },
      { status: result.upsertedCount ? 201 : 200 },
    );
  } catch (error) {
    console.error("MongoDB evaluation error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Không thể lưu phiếu đánh giá QC." },
      { status: 500 },
    );
  }
}
