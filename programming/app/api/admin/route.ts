import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteAdminCourse, deleteAdminProblem, getAdminData, updateAdminLearner, upsertAdminCourse, upsertAdminProblem } from "@/lib/db";
import type { Course, Problem } from "@/lib/types";
import { sameOrigin } from "@/lib/user-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!await isAdminAuthenticated()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(await getAdminData(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  if (!await isAdminAuthenticated()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { action?: string; payload?: Record<string, unknown> } | null;
  if (!body?.action || !body.payload) return Response.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });

  try {
    let courseId: string | undefined;
    switch (body.action) {
      case "saveCourse":
        if (typeof body.payload.title !== "string" || !body.payload.title.trim()) throw new Error("Tên khóa học là bắt buộc.");
        courseId = await upsertAdminCourse(body.payload as Partial<Course> & { title: string });
        break;
      case "deleteCourse":
        if (typeof body.payload.id !== "string") throw new Error("ID khóa học không hợp lệ.");
        await deleteAdminCourse(body.payload.id);
        break;
      case "saveProblem":
        if (typeof body.payload.title !== "string" || !body.payload.title.trim()) throw new Error("Tên bài tập là bắt buộc.");
        await upsertAdminProblem(body.payload as Partial<Problem> & { title: string });
        break;
      case "deleteProblem":
        if (typeof body.payload.id !== "number") throw new Error("ID bài tập không hợp lệ.");
        await deleteAdminProblem(body.payload.id);
        break;
      case "updateLearner":
        if (typeof body.payload.id !== "string") throw new Error("ID học viên không hợp lệ.");
        if (typeof body.payload.name !== "string" || typeof body.payload.level !== "number" || typeof body.payload.xp !== "number") throw new Error("Thông tin học viên không hợp lệ.");
        await updateAdminLearner(body.payload.id, {
          name: body.payload.name,
          level: body.payload.level,
          xp: body.payload.xp,
        });
        break;
      default:
        return Response.json({ error: "Thao tác không được hỗ trợ." }, { status: 400 });
    }
    return Response.json({ ...await getAdminData(), ...(courseId ? { courseId } : {}) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Không thể cập nhật dữ liệu." }, { status: 400 });
  }
}
