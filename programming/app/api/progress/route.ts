import { completeLesson } from "@/lib/course-progress";
import { getSessionUser, sameOrigin } from "@/lib/user-auth";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  if (!await getSessionUser()) return Response.json({ error: "Vui lòng đăng nhập." }, { status: 401 });
  const raw = await request.text();
  if (raw.length > 2048) return Response.json({ error: "Dữ liệu quá dài." }, { status: 413 });
  let body;
  try { body = JSON.parse(raw); } catch { return Response.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 }); }
  if (!body || typeof body.courseId !== "string" || typeof body.lessonId !== "string" || "progress" in body) {
    return Response.json({ error: "Dữ liệu tiến độ không hợp lệ." }, { status: 400 });
  }

  try {
    await completeLesson(body.courseId, body.lessonId);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Không thể cập nhật tiến độ." }, { status: 404 });
  }
}
