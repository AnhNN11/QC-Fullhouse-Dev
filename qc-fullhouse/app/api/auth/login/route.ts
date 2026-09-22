import { NextResponse } from "next/server";
import { createSessionToken, secureEqual, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(request: Request) {
  const configuredUsername = process.env.APP_LOGIN_USERNAME;
  const configuredPassword = process.env.APP_LOGIN_PASSWORD;
  const sessionSecret = process.env.APP_SESSION_SECRET;

  if (!configuredUsername || !configuredPassword || !sessionSecret) {
    return NextResponse.json(
      { error: "Tài khoản đăng nhập chưa được cấu hình trên máy chủ." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = body.username?.trim() ?? "";
    const password = body.password ?? "";
    const [usernameMatches, passwordMatches] = await Promise.all([
      secureEqual(username, configuredUsername),
      secureEqual(password, configuredPassword),
    ]);

    if (!usernameMatches || !passwordMatches) {
      return NextResponse.json({ error: "Tên đăng nhập hoặc mật khẩu không đúng." }, { status: 401 });
    }

    const response = NextResponse.json({ message: "Đăng nhập thành công." });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: await createSessionToken(configuredUsername),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Dữ liệu đăng nhập không hợp lệ." }, { status: 400 });
  }
}
