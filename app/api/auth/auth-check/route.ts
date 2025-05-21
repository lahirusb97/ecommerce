// app/api/auth/check/route.ts
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwtToken"; // your JWT utility

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return Response.json({ authenticated: false });
  }
  try {
    const user = await verifyJwt(token);
    return Response.json({ authenticated: !!user });
  } catch {
    return Response.json({ authenticated: false });
  }
}
