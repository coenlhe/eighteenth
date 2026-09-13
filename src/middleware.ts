import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "./lib/auth";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Allow public routes without authentication
  if (path === "/admin/login" || path.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // 2. Protect /admin and /admin/dashboard
  if (path.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = token ? verifySessionToken(token) : false;

    if (!isValid) {
      // Redirect unauthenticated admin requests straight to the login page
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};