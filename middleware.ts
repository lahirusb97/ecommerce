import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/admin"];
const publicRoutes = ["/login", "/register"];

export default function middleware(req: NextRequest) {
  const session = req.cookies.get("session");
  if (!session) {
    if (
      protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    if (publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}
