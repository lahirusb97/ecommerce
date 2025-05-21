import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwtToken";
import LoginPageClient from "@/components/login-form";

// This runs ONLY on the server!
export default async function page() {
  const token = (await cookies()).get("token")?.value;
  let authenticated = false;
  if (token) {
    try {
      const payload = await verifyJwt(token);
      authenticated = !!payload;
    } catch {
      authenticated = false;
    }
  }

  return <LoginPageClient authenticated={authenticated} />;
}
