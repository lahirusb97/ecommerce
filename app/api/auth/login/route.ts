import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwtToken";
import { prisma } from "@/lib/prisma";

// API route only supports POST
export async function POST(req: NextRequest) {
  const body = await req.json();
  const identifier = body.identifier?.toString() || "";
  const password = body.password?.toString() || "";

  // Basic validation
  if (!identifier || !password) {
    return NextResponse.json(
      {
        success: false,
        message: "Please enter both email/phone and password.",
        errors: {
          identifier: !identifier ? ["Required"] : undefined,
          password: !password ? ["Required"] : undefined,
        },
        formData: { identifier },
      },
      { status: 400 }
    );
  }

  // Find user by email or phone
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid credentials.",
        errors: { identifier: ["User not found"] },
        formData: { identifier },
      },
      { status: 401 }
    );
  }

  // Check password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid credentials.",
        formData: { identifier },
      },
      { status: 401 }
    );
  }

  // Generate JWT
  const token = await signJwt({ userId: Number(user.id), role: user.role });

  // Set HttpOnly cookie
  const response = NextResponse.json({
    success: true,
    message: "Login successful.",
    role: user.role, // Frontend can use this for redirecting
  });
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
