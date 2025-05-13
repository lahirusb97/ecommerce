"use server";

import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

type SessionPayload = {
  userId: string;
  expireAt: Date;
};

// Validate SESSION_SECRET at startup
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not defined in environment variables");
}
const secretKey = new TextEncoder().encode(SESSION_SECRET);

export async function createSession(userId: string): Promise<string> {
  try {
    const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
    const session = await encrypt({ userId, expireAt });

    cookies().set({
      name: "session",
      value: session,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return session;
  } catch (error) {
    console.error("Failed to create session:", error);
    throw new Error("Failed to create session");
  }
}

export async function deleteSession(): Promise<void> {
  cookies().delete("session");
}

async function encrypt(payload: SessionPayload): Promise<string> {
  try {
    return await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt session data");
  }
}

export async function decrypt(
  session: string | undefined = ""
): Promise<JWTPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, secretKey);
    return payload;
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const session = cookies().get("session")?.value;
  if (!session) return null;

  const payload = await decrypt(session);
  if (!payload || !payload.userId || !payload.expireAt) return null;

  // Check if session is expired
  if (new Date(payload.expireAt as string) < new Date()) {
    await deleteSession();
    return null;
  }

  return {
    userId: payload.userId as string,
    expireAt: new Date(payload.expireAt as string),
  };
}
