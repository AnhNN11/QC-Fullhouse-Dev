import { getSessionUser, sameOrigin } from "@/lib/user-auth";
import { getBlockChallenge, challengeRevision, type BlockResult } from "@/lib/block-store";
import { gradeBlocks, validateProgram } from "@/lib/blocks";
import { getMongoDatabase } from "@/lib/mongodb";
import { recordActivity } from "@/lib/record-activity";
export const runtime = "nodejs";
export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  if (!sameOrigin(request)) return Response.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Đăng nhập để nộp bài và lưu điểm." }, { status: 401 });
  const raw = await request.text();
  if (raw.length > 20000) return Response.json({ error: "Chương trình quá dài." }, { status: 413 });
  let body;
  try { body = JSON.parse(raw); } catch { return Response.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 }); }
  try {
    const { slug } = await context.params;
    const challenge = await getBlockChallenge(slug);
    if (!challenge) return Response.json({ error: "Bài đã ẩn hoặc không tồn tại." }, { status: 404 });
    const program = validateProgram(body?.program, challenge.allowed);
    const db = await getMongoDatabase();
    const limits = db.collection<{ _id: string; count: number; expiresAt: Date }>("block_attempt_limits");
    await limits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    const window = Math.floor(Date.now() / 60000);
    const limit = await limits.findOneAndUpdate({ _id: `${user.id}:${window}` }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((window + 2) * 60000) } }, { upsert: true, returnDocument: "after" });
    if (!limit || limit.count > 30) return Response.json({ error: "Tối đa 30 lần nộp mỗi phút. Hãy chạy thử trước khi nộp lại." }, { status: 429 });
    const grade = gradeBlocks(challenge, program), revision = challengeRevision(challenge);
    const result = await db.collection<BlockResult>("block_results").findOneAndUpdate({ _id: JSON.stringify([user.id, slug, revision]) }, { $set: { userId: user.id, slug, revision, lastScore: grade.score, program, updatedAt: new Date() }, $max: { bestScore: grade.score }, $inc: { attempts: 1 } }, { upsert: true, returnDocument: "after" });
    await recordActivity(user.id);
    return Response.json({ ...grade, bestScore: result!.bestScore, attempts: result!.attempts }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Chưa chấm được bài." }, { status: 400 }); }
}
