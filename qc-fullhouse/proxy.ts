import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLoginPage = pathname === "/login";
  const isAuthApi = pathname.startsWith("/api/auth/");

  if (isAuthApi) return NextResponse.next();

  const authenticated = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (isLoginPage) {
    return authenticated
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }

  if (!authenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
