// lib/auth.ts
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwtToken";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  const payload = verifyJwt<{ userId: number; role: string }>(token);
  if (!payload) return null;
  const dbUser = await prisma.user.findUnique({
    where: { id: payload.userId },
  });
  if (!dbUser) return null;
  return { userId: dbUser.id, email: dbUser.email, role: dbUser.role };
}
