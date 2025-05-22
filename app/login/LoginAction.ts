"use server";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwtToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export type LoginFormState =
  | { success: true; message: string }
  | {
      success: false;
      message: string;
      errors?: { identifier?: string[]; password?: string[] };
      formData?: { identifier: string };
    };

export async function loginAction(
  prevState: LoginFormState | undefined,
  formData: FormData
): Promise<LoginFormState> {
  const identifier = formData.get("identifier")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  // Basic validation
  if (!identifier || !password) {
    return {
      success: false,
      message: "Please enter both email/phone and password.",
      errors: {
        identifier: !identifier ? ["Required"] : undefined,
        password: !password ? ["Required"] : undefined,
      },
      formData: { identifier },
    };
  }

  // Find user by email or phone
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
  });

  if (!user) {
    return {
      success: false,
      message: "Invalid credentials.",
      errors: { identifier: ["User not found"] },
      formData: { identifier },
    };
  }

  // Check password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return {
      success: false,
      message: "Invalid credentials.",
      formData: { identifier },
    };

  // Generate and set JWT
  const token = await signJwt({ userId: BigInt(user.id), role: user.role });
  (await cookies()).set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production", // 👈 Secure in production
  });

  // Server-side redirect based on role
  if (user.role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/myaccount");
  }
}
