"use server";

import { clearAdminSession, createAdminSession, validateAdminCredentials } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { getMongoDatabase } from "@/lib/mongodb";

export type LoginState = { error?: string } | undefined;

export async function loginAdmin(_state: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) return { error: "Vui lòng nhập đầy đủ tài khoản và mật khẩu." };
  if (username.length > 100 || password.length > 256) return { error: "Thông tin đăng nhập quá dài." };
  // One shared bucket prevents bypassing the limit by changing the submitted username.
  try {
    const db = await getMongoDatabase();
    const limits = db.collection<{ _id: string; count: number; expiresAt: Date }>("admin_login_limits");
    await limits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    const window = Math.floor(Date.now() / 600_000);
    const attempt = await limits.findOneAndUpdate({ _id: String(window) }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((window + 2) * 600_000) } }, { upsert: true, returnDocument: "after" });
    if (!attempt || attempt.count > 10) return { error: "Quá nhiều lần thử. Vui lòng thử lại sau 10 phút." };
  } catch { return { error: "Chưa thể đăng nhập. Vui lòng thử lại sau." }; }
  if (!validateAdminCredentials(username, password)) return { error: "Tài khoản hoặc mật khẩu không đúng." };
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin");
}
