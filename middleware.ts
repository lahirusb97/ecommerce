import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "./lib/jwtToken";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const payload = token ? await verifyJwt(token) : null;

  if (!payload && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔒 Redirect signed-in users away from /login
  if (pathname === "/login") {
    if (payload?.role === "CUSTOMER") {
      return NextResponse.redirect(new URL("/myaccount", request.url));
    }
    if (payload?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next(); // fallback: let them see /login
  }

  // 🚫 Prevent customers accessing admin
  if (pathname.startsWith("/admin") && payload?.role === "CUSTOMER") {
    return NextResponse.redirect(new URL("/myaccount", request.url));
  }

  // 🚫 Only admins can access /admin
  if (pathname.startsWith("/admin") && payload?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🚫 Only customers can access /myaccount
  if (pathname.startsWith("/myaccount") && payload?.role !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/myaccount/:path*",
    "/myaccount",
    "/login",
  ],
};
