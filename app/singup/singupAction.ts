"use server";

import { schemaSignUp, SchemaSignUpModel } from "@/schema/schemaSingUp";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { signJwt } from "@/lib/jwtToken";
import { redirect } from "next/navigation";

export type FormState =
  | { success: true; message: string }
  | {
      success: false;
      message: string;
      errors?: Partial<Record<keyof SchemaSignUpModel, string[]>>;
      formData?: Partial<SchemaSignUpModel>;
    };

export async function singupAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const plainFormData: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    plainFormData[key] = value as string;
  }

  const result = schemaSignUp.safeParse(plainFormData);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Validation failed",
      errors: fieldErrors,
      formData: plainFormData as SchemaSignUpModel,
    };
  }
  const { name, email, password, phone } = result.data;
  const safeEmail = email && email.trim() !== "" ? email : null;
  const safePhone = phone && phone.trim() !== "" ? phone : null;

  let existingUser = null;

  if (safeEmail && safePhone) {
    existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: safeEmail }, { phone: safePhone }],
      },
    });
  } else if (safeEmail) {
    existingUser = await prisma.user.findUnique({
      where: { email: safeEmail },
    });
  } else if (safePhone) {
    existingUser = await prisma.user.findUnique({
      where: { phone: safePhone },
    });
  }
  if (existingUser) {
    if (existingUser.email === safeEmail || existingUser.phone === safePhone) {
      if (existingUser.email === safeEmail) {
        return {
          success: false,
          message: "User with this email already exists",
          formData: { email, name, phone },
        };
      }

      if (existingUser.phone === safePhone) {
        return {
          success: false,
          message: "User with this phone already exists",
          formData: { email, name, phone },
        };
      }
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email: safeEmail,
      password: hashedPassword,
      phone: safePhone,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  const token = await signJwt({ userId: user.id, role: user.role });
  (await cookies()).set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production", // 👈 Secure in production
  });

  redirect("/");
}
