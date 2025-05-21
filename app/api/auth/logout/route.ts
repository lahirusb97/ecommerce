// app/api/auth/logout/route.ts
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).set("token", "", { maxAge: -1, path: "/" });
  return new Response(null, { status: 200 });
}
