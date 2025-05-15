import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "./lib/jwtToken";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login") return NextResponse.next();
  const token = request.cookies.get("token")?.value;
  const payload = token ? await verifyJwt(token) : null;
  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // If trying to access login Custome to admin or superadmin
  if (pathname.startsWith("/admin") && payload.role === "CUSTOMER") {
    return NextResponse.redirect(new URL("/myaccount", request.url));
  }
  // If trying to access /admin as a non-admin
  if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // If trying to access /myaccount as a non-customer
  if (pathname.startsWith("/myaccount") && payload.role !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/myaccount/:path*", "/myaccount"],
};
