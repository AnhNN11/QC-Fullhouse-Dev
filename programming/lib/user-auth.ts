import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getMongoDatabase } from "./mongodb";

export type SessionUser = { id: string; name: string; email: string };
const COOKIE = "dolphinx_session";
const DAYS = 7 * 86400;
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
let indexes: Promise<unknown> | undefined;
export async function authDatabase() {
  const db = await getMongoDatabase();
  indexes ??= Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("user_sessions").createIndex({ tokenHash: 1 }, { unique: true }),
    db.collection("user_sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("auth_limits").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]).catch(error => { indexes = undefined; throw error; });
  await indexes;
  return db;
}
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const db = await getMongoDatabase();
  const session = await db.collection("user_sessions").findOne({ tokenHash: digest(token), expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) }, { projection: { name: 1, email: 1 } });
  return user ? { id: user._id.toString(), name: user.name, email: user.email } : null;
}
export async function clearUserSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await (await getMongoDatabase()).collection("user_sessions").deleteOne({ tokenHash: digest(token) });
  jar.delete(COOKIE);
}
export async function createUserSession(userId: string) {
  await clearUserSession();
  const token = randomBytes(32).toString("hex");
  await (await authDatabase()).collection("user_sessions").insertOne({ userId, tokenHash: digest(token), expiresAt: new Date(Date.now() + DAYS * 1000) });
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: DAYS });
}
export function sameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}
export async function allowAuthAttempt(email: string) {
  const db = await authDatabase();
  const window = Math.floor(Date.now() / 600_000);
  for (const [key, max] of [[digest(email), 10], ["global", 200]] as const) {
    const result = await db.collection<{ _id: string; count: number; expiresAt: Date }>("auth_limits").findOneAndUpdate(
      { _id: `${key}:${window}` },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((window + 2) * 600_000) } },
      { upsert: true, returnDocument: "after" },
    );
    if (!result || result.count > max) return false;
  }
  return true;
}
