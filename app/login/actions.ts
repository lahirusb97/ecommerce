"use server";

import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

type LoginFormState = {
  error?: {
    email?: string[] | undefined;
    password?: string[] | undefined;
  };
  message?: string;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export async function login(
  prevState: LoginFormState | undefined,
  formData: FormData
): Promise<LoginFormState> {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist or password doesn't match
    if (!user || !(await compare(password, user.password))) {
      return {
        error: {
          email: ["Invalid email or password"],
          password: ["Invalid email or password"],
        },
      };
    }

    // Create session and redirect on successful login
    await createSession(user.email);
    redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    return {
      message: "An error occurred during login. Please try again.",
    };
  }
}

// export async function logOut() {
//   "use server";
//   const { deleteSession } = await import("@/lib/session");
//   await deleteSession();
//   redirect("/login");
// }
