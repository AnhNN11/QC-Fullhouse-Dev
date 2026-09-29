import { grade, validateTests } from "@/lib/grading";
import { getMongoDatabase } from "@/lib/mongodb";
import { saveSubmission } from "@/lib/db";
import { recordActivity } from "@/lib/record-activity";
import { getSessionUser, sameOrigin } from "@/lib/user-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Vui lòng đăng nhập." }, { status: 401 });
  const body = await request.json().catch(() => null) as { problemId?: unknown; language?: unknown; code?: unknown; mode?: unknown } | null;
  if (!body || typeof body.problemId !== "number" || typeof body.language !== "string" || typeof body.code !== "string") {
    return Response.json({ error: "Bài nộp không hợp lệ." }, { status: 400 });
  }
  if (body.code.length > 20_000) {
    return Response.json({ error: "Lời giải vượt quá giới hạn 20.000 ký tự." }, { status: 413 });
  }
  if (!Number.isSafeInteger(body.problemId) || !body.code.trim()) return Response.json({ error: 'Bài hoặc lời giải không hợp lệ.' }, { status: 400 });

  if (body.language !== 'javascript' || !['run', 'submit'].includes(String(body.mode))) return Response.json({ error: 'Chỉ hỗ trợ JavaScript, mode run hoặc submit.' }, { status: 400 });
  const db = await getMongoDatabase();
  const config = await db.collection('judge_configs').findOne({ problemId: body.problemId, enabled: true });
  if (!config) return Response.json({ error: 'Bài này chưa có bộ test được admin duyệt.' }, { status: 409 });
  const leases = db.collection<{ _id: string; expiresAt: Date }>('judge_leases');
  const lease = await leases.findOneAndUpdate({ _id: user.id }, { $setOnInsert: { expiresAt: new Date(0) } }, { upsert: true, returnDocument: 'after' });
  if (!lease || !await leases.findOneAndUpdate({ _id: user.id, expiresAt: { $lte: new Date() } }, { $set: { expiresAt: new Date(Date.now() + 12_000) } })) return Response.json({ error: 'Vui lòng chờ 12 giây giữa hai lượt chấm.' }, { status: 429 });
  try {
    const all = validateTests(config.tests);
    const result = await grade(body.code, body.mode === 'run' ? all.filter(t => t.sample) : all);
    if (body.mode === 'submit') { await saveSubmission(body.problemId, body.language, body.code, result); await recordActivity(user.id); }
    return Response.json({ ...result, mode: body.mode });
  } catch { return Response.json({ error: 'Không thể xác nhận lượt chấm (bận, quá giới hạn hoặc lỗi lưu). Hãy tải lại tiến độ trước khi thử lại.' }, { status: 503 }); }
}
