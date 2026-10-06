import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoClient } from "@/lib/mongodb";

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
    const outcome = body.outcome;

    if (!sessionId || !ObjectId.isValid(sessionId) || !Number.isFinite(score) || score < 0 || score > 100 || !["reviewed", "issue"].includes(String(outcome))) {
      return NextResponse.json(
        { error: "Buổi học, kết quả hợp lệ và điểm từ 0 đến 100 là bắt buộc." },
        { status: 400 },
      );
    }
    if (note.length > 1000) return NextResponse.json({ error: "Nhận xét QC không được vượt quá 1.000 ký tự." }, { status: 400 });
    if (!note) return NextResponse.json({ error: "Cần nhập nhận xét cho buổi học này." }, { status: 400 });

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB ?? "fullhouse_qc");
    const evaluationCollection = db.collection("qc_evaluations");
    const evaluationIndexes = await evaluationCollection.indexes();
    if (!evaluationIndexes.some((index) => index.key?.sessionId === 1 && index.unique)) {
      await evaluationCollection.createIndex({ sessionId: 1 }, { unique: true });
    }
    const mongoSession = client.startSession();
    let created = false;
    try {
      await mongoSession.withTransaction(async () => {
        const lesson = await db.collection("class_sessions").findOne(
          { _id: new ObjectId(sessionId) },
          { session: mongoSession },
        );
        if (!lesson) throw new Error("LESSON_NOT_FOUND");
        if (lesson.sourceSystem !== "fullhousedev") throw new Error("INVALID_SOURCE");
        if (Number(lesson.recordingCount ?? 0) < 1 || !lesson.recordingUrl) throw new Error("RECORDING_NOT_READY");

        const now = new Date();
        const result = await evaluationCollection.updateOne(
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
          { upsert: true, session: mongoSession },
        );
        created = result.upsertedCount > 0;
        await db.collection("class_sessions").updateOne(
          { _id: lesson._id },
          { $set: { recordingStatus: outcome, qcScore: score, qcNote: note, qcReviewedAt: now, updatedAt: now } },
          { session: mongoSession },
        );
        const teacherIds = Array.isArray(lesson.teacherIds)
          ? lesson.teacherIds.map(String).filter(ObjectId.isValid)
          : [];
        for (const teacherId of teacherIds) {
          const [summary] = await evaluationCollection.aggregate([
            { $match: { teacherIds: teacherId } },
            { $group: { _id: null, average: { $avg: "$score" } } },
          ], { session: mongoSession }).toArray();
          if (summary?.average !== undefined) {
            await db.collection("teachers").updateOne(
              { _id: new ObjectId(teacherId) },
              { $set: { score: Math.round(Number(summary.average) * 10) / 10, updatedAt: now } },
              { session: mongoSession },
            );
          }
        }
      });
    } catch (error) {
      if (error instanceof Error && error.message === "LESSON_NOT_FOUND") return NextResponse.json({ error: "Không tìm thấy buổi học." }, { status: 404 });
      if (error instanceof Error && error.message === "INVALID_SOURCE") return NextResponse.json({ error: "Buổi học này không thuộc dữ liệu crawl Fullhouse." }, { status: 409 });
      if (error instanceof Error && error.message === "RECORDING_NOT_READY") return NextResponse.json({ error: "Buổi học chưa có recording để QC." }, { status: 409 });
      throw error;
    } finally {
      await mongoSession.endSession();
    }

    return NextResponse.json(
      { id: sessionId, message: "Đã lưu phiếu đánh giá và cập nhật trạng thái record." },
      { status: created ? 201 : 200 },
    );
  } catch (error) {
    console.error("MongoDB evaluation error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Không thể lưu phiếu đánh giá QC." },
      { status: 500 },
    );
  }
}
