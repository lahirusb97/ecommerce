"use server";

import { schemaSingUp, SchemaSingUpModel } from "@/schema/schemaSingUp";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
const JWT_SECRET = process.env.SESSION_SECRET;

export type FormState = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof SchemaSingUpModel, string[]>>;
  formData?: Partial<SchemaSingUpModel>;
};

export async function singupAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const plainFormData = Object.create(null);
    for (const [key, value] of formData.entries()) {
      plainFormData[key] = value;
    }

    const result = schemaSingUp.safeParse(plainFormData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      return {
        success: false,
        message: "Validation failed",
        errors: fieldErrors,
        formData: plainFormData as SchemaSingUpModel,
      };
    }
    const { name, email, password, phone } = result.data;
    // Check if email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email }, // Check if email exists
          { phone: phone }, // Check if phone exists
        ],
      },
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return {
          success: false,
          message: "User with this email already exists",
          formData: { email, name, phone },
        };
      } else if (existingUser.phone === phone) {
        return {
          success: false,
          message: "User with this phone already exists",
          formData: { email, name, phone },
        };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      },
    });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET!, {
      expiresIn: "1d",
    });

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
    });

    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (error) {
    console.error("Error during signup:", error);
    return {
      success: false,
      message: "An error occurred during signup. Please try again.",
    };
  }
}
