import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "dolphinx_admin";
const SESSION_SECONDS = 60 * 60 * 8;

function credentials() {
  const username=process.env.ADMIN_USERNAME,password=process.env.ADMIN_PASSWORD,secret=process.env.ADMIN_SESSION_SECRET;
  return username&&password&&secret ? {username,password,secret} : null;
}

function sign(expiresAt: number) {
  const config=credentials();
  if(!config)throw new Error('Chưa cấu hình tài khoản quản trị trong môi trường.');
  return createHmac("sha256", config.secret).update(JSON.stringify([expiresAt, config.username, config.password])).digest("hex");
}

export function validateAdminCredentials(username: string, password: string) {
  const expected = credentials();
  if(!expected)return false;
  const left = Buffer.from(`${username}\0${password}`);
  const right = Buffer.from(`${expected.username}\0${expected.password}`);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${expiresAt}.${sign(expiresAt)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_SECONDS,
    path: "/",
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  if(!credentials())return false;
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;
  const [expiresRaw, signature] = value.split(".");
  const expiresAt = Number(expiresRaw);
  if (!expiresAt || expiresAt < Math.floor(Date.now() / 1000) || !signature) return false;
  const expected = Buffer.from(sign(expiresAt));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
