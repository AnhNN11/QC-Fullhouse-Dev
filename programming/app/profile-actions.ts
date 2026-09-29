"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getSessionUser, allowAuthAttempt, createUserSession } from "@/lib/user-auth";
import { getMongoDatabase } from "@/lib/mongodb";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import type { ActionState } from "./academy/actions";

export async function saveProfile(_: ActionState, form: FormData): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "Vui lòng đăng nhập để cập nhật hồ sơ." };
  const value = (key: string) => typeof form.get(key) === "string" ? String(form.get(key)).trim() : "";
  const name = value("name"), bio = value("bio"), goal = value("goal"), website = value("website");
  if (name.length < 2 || name.length > 80 || bio.length > 500 || goal.length > 500 || website.length > 300) return { error: "Kiểm tra họ tên (2–80 ký tự), giới thiệu và mục tiêu (tối đa 500 ký tự)." };
  if (website) {
    try { if (new URL(website).protocol !== "https:") throw new Error(); }
    catch { return { error: "Website cần là đường dẫn HTTPS hợp lệ." }; }
  }
  try {
    const db = await getMongoDatabase();
    const result = await db.collection("users").updateOne({ _id: new ObjectId(user.id) }, { $set: { name, bio, goal, website, updatedAt: new Date() } });
    if (!result.matchedCount) return { error: "Tài khoản không còn tồn tại." };
    revalidatePath("/", "layout");
    return { success: "Đã lưu hồ sơ của bạn." };
  } catch { return { error: "Chưa thể lưu hồ sơ. Vui lòng thử lại." }; }
}

export async function changePassword(_: ActionState, form: FormData): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "Phiên đăng nhập đã hết hạn." };
  const current = form.get("currentPassword"), password = form.get("password"), confirm = form.get("confirmPassword");
  if (typeof current !== "string" || current.length < 8 || current.length > 128 || typeof password !== "string" || password.length < 8 || password.length > 128 || password !== confirm) return { error: "Mật khẩu cần từ 8–128 ký tự và xác nhận phải trùng khớp." };
  if (current === password) return { error: "Hãy chọn mật khẩu khác mật khẩu hiện tại." };
  try {
    if (!await allowAuthAttempt(`profile-password:${user.id}`)) return { error: "Bạn đã thử nhiều lần. Vui lòng thử lại sau 10 phút." };
    const db = await getMongoDatabase();
    const account = await db.collection("users").findOne({ _id: new ObjectId(user.id) });
    if (!account || typeof account.passwordHash !== "string" || !await verifyPassword(current, account.passwordHash)) return { error: "Mật khẩu hiện tại chưa đúng." };
    const passwordHash = await hashPassword(password);
    const result = await db.collection("users").updateOne({ _id: account._id, passwordHash: account.passwordHash }, { $set: { passwordHash, passwordChangedAt: new Date() } });
    if (!result.modifiedCount) return { error: "Tài khoản vừa thay đổi. Vui lòng đăng nhập lại." };
    await db.collection("user_sessions").deleteMany({ userId: user.id });
    await createUserSession(user.id);
    revalidatePath("/", "layout");
    return { success: "Đã đổi mật khẩu và đăng xuất các phiên cũ. Phiên hiện tại đã được làm mới." };
  } catch { return { error: "Chưa hoàn tất thao tác. Nếu phiên đã hết hạn, hãy đăng nhập lại bằng mật khẩu mới." }; }
}
