import { roadmapNodes } from "@/lib/roadmaps";
import { getManagedRoadmap } from "@/lib/managed-content";
import { getSessionUser, sameOrigin } from "@/lib/user-auth";
import { getMongoDatabase } from "@/lib/mongodb";
import { recordActivity } from "@/lib/record-activity";
export const runtime = "nodejs";
type Context = { params: Promise<{ slug: string }> };
export async function GET(_: Request, { params }: Context) {
  const { slug } = await params;
  if (!await getManagedRoadmap(slug)) return Response.json({ error: "Không tìm thấy lộ trình." }, { status: 404 });
  try {
    const user = await getSessionUser();
    if (!user) return Response.json({ user: null, statuses: {} }, { headers: { "Cache-Control": "no-store" } });
    const records = await (await getMongoDatabase()).collection("roadmap_progress").find({ userId: user.id, slug }, { projection: { nodeId: 1, status: 1 } }).toArray();
    return Response.json({ user, statuses: Object.fromEntries(records.map(item => [item.nodeId, item.status])) }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Chưa tải được tiến độ. Vui lòng thử lại." }, { status: 503 }); }
}
export async function PUT(request: Request, { params }: Context) {
  if (!sameOrigin(request)) return Response.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  const { slug } = await params;
  const roadmap = (await getManagedRoadmap(slug))?.roadmap;
  if (!roadmap) return Response.json({ error: "Không tìm thấy lộ trình." }, { status: 404 });
  try {
    const user = await getSessionUser();
    if (!user) return Response.json({ error: "Vui lòng đăng nhập để lưu tiến độ." }, { status: 401 });
    const raw = await request.text();
    if (raw.length > 1024) return Response.json({ error: "Dữ liệu quá dài." }, { status: 413 });
    let body;
    try { body = JSON.parse(raw); } catch { return Response.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 }); }
    if (!body || !roadmapNodes(roadmap).some(node=>node.id===body.nodeId) || !["new","learning","done"].includes(body.status)) return Response.json({ error: "Chủ đề hoặc trạng thái không hợp lệ." }, { status: 400 });
    await (await getMongoDatabase()).collection<{ _id: string; userId: string; slug: string; nodeId: string; status: string; updatedAt: Date }>("roadmap_progress").updateOne(
      { _id: `${user.id}:${slug}:${body.nodeId}` }, { $set: { userId: user.id, slug, nodeId: body.nodeId, status: body.status, updatedAt: new Date() } }, { upsert: true },
    );
    if (body.status !== "new") await recordActivity(user.id);
    return Response.json({ ok: true });
  } catch { return Response.json({ error: "Chưa lưu được tiến độ. Vui lòng thử lại." }, { status: 503 }); }
}
