import "server-only";
import { createCipheriv, createDecipheriv, randomBytes, createHash } from "node:crypto";

function key() {
  const value = process.env.VIDEO_ENCRYPTION_KEY;
  if (!value || !/^[a-f0-9]{64}$/i.test(value)) throw new Error("Cần VIDEO_ENCRYPTION_KEY gồm 64 ký tự hex.");
  return Buffer.from(value, "hex");
}

export function encryptVideo(url: string) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") throw new Error("Video phải dùng HTTPS.");
  const hosts = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com"];
  if (!hosts.includes(parsed.hostname)) throw new Error("Chỉ hỗ trợ link YouTube.");
  const id = parsed.hostname === "youtu.be" ? parsed.pathname.slice(1) : parsed.searchParams.get("v") ?? parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1];
  if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) throw new Error("Link video YouTube không hợp lệ.");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(id, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64url")).join(".");
}

export function decryptVideo(value: string) {
  const [iv, tag, encrypted] = value.split(".").map((part) => Buffer.from(part, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

export function hashAccess(value: string) { return createHash("sha256").update(value).digest("hex"); }
