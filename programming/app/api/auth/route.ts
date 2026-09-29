import { authDatabase, allowAuthAttempt, createUserSession, clearUserSession, getSessionUser, sameOrigin } from "@/lib/user-auth";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import { MongoServerError } from "mongodb";

export const runtime = "nodejs";
const fail = (error: string, status = 400) => Response.json({ error }, { status });
export async function GET() {
  try { return Response.json({ user: await getSessionUser() }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return fail("Không thể kiểm tra phiên đăng nhập.", 503); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return fail("Yêu cầu không hợp lệ.", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return fail("Yêu cầu không hợp lệ.", 415);
  const raw = await request.text();
  if (raw.length > 4096) return fail("Dữ liệu quá dài.", 413);
  let body;
  try { body = JSON.parse(raw); } catch { return fail("Dữ liệu không hợp lệ."); }
  if (!body || typeof body.email !== "string" || typeof body.password !== "string" || !["login", "register"].includes(body.mode)) return fail("Vui lòng nhập email và mật khẩu.");
  const email = body.email.trim().toLowerCase();
  const password = body.password;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 128) return fail("Email hợp lệ và mật khẩu từ 8–128 ký tự là bắt buộc.");
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (body.mode === "register" && (name.length < 2 || name.length > 80 || body.confirmPassword !== password)) return fail("Kiểm tra họ tên (2–80 ký tự) và xác nhận mật khẩu.");
  try {
    if (!await allowAuthAttempt(email)) return fail("Bạn đã thử nhiều lần. Vui lòng thử lại sau 10 phút.", 429);
    const db = await authDatabase();
    let user = await db.collection("users").findOne({ email });
    if (body.mode === "register") {
      if (user) return fail("Không thể đăng ký email này. Hãy đăng nhập hoặc dùng email khác.", 409);
      const passwordHash = await hashPassword(password);
      const result = await db.collection("users").insertOne({ email, name, passwordHash, xp: 0, createdAt: new Date() });
      user = { _id: result.insertedId, email, name };
    } else {
      // Perform the same expensive password work for unknown accounts.
      const stored = user?.passwordHash ?? "scrypt:00000000000000000000000000000000:" + "0".repeat(128);
      if (!await verifyPassword(password, stored) || !user) return fail("Email hoặc mật khẩu chưa đúng.", 401);
    }
    await createUserSession(user._id.toString());
    return Response.json({ user: { id: user._id.toString(), name: user.name, email: user.email } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) return fail("Không thể đăng ký email này. Hãy đăng nhập hoặc dùng email khác.", 409);
    return fail("Chưa thể đăng nhập lúc này. Vui lòng thử lại.", 503);
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return fail("Yêu cầu không hợp lệ.", 403);
  try { await clearUserSession(); return Response.json({ ok: true }); }
  catch { return fail("Chưa thể đăng xuất. Vui lòng thử lại.", 503); }
}
