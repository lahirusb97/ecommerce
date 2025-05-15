// lib/jwt.ts
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables!");
}
const encoder = new TextEncoder();
// Sign JWT (async)

type JwtPayload = {
  userId: number;
  role: "CUSTOMER" | "ADMIN" | "SUPERADMIN";
};

export async function signJwt(payload: JwtPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime("7d")
    .sign(encoder.encode(JWT_SECRET));
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
    return payload as JwtPayload;
  } catch {
    return null;
  }
}
