const encoder = new TextEncoder();

export const SESSION_COOKIE = "fullhouse_qc_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  exp: number;
};

function toBase64Url(value: string | Uint8Array) {
  const bytes = typeof value === "string" ? encoder.encode(value) : value;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function getSigningKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(username: string) {
  const secret = process.env.APP_SESSION_SECRET;
  if (!secret) throw new Error("APP_SESSION_SECRET chưa được cấu hình.");

  const payload: SessionPayload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getSigningKey(secret),
    encoder.encode(encodedPayload),
  );
  return `${encodedPayload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token?: string) {
  const secret = process.env.APP_SESSION_SECRET;
  if (!secret || !token) return false;

  try {
    const [encodedPayload, encodedSignature, extra] = token.split(".");
    if (!encodedPayload || !encodedSignature || extra) return false;

    const validSignature = await crypto.subtle.verify(
      "HMAC",
      await getSigningKey(secret),
      fromBase64Url(encodedSignature),
      encoder.encode(encodedPayload),
    );
    if (!validSignature) return false;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload))) as SessionPayload;
    return Boolean(payload.sub && payload.exp > Math.floor(Date.now() / 1000));
  } catch {
    return false;
  }
}

export async function secureEqual(left: string, right: string) {
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  const leftBytes = new Uint8Array(leftHash);
  const rightBytes = new Uint8Array(rightHash);
  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }
  return difference === 0;
}
