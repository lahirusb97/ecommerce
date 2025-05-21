// app/checkout/page.tsx (Server Component)
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwtToken";
import { CheckoutForm } from "@/components/CheckoutForm";
import { prisma } from "@/lib/prisma";

export default async function page() {
  // 1. Get userId from JWT if present
  const token = (await cookies()).get("token")?.value;
  let email: string | null = null;
  let phone: string | null = null;
  let userId: string | null = null;

  if (token) {
    try {
      const payload = await verifyJwt(token);
      userId = payload?.userId?.toString() || null; // Make sure userId is a string

      // 2. Fetch user data from DB if userId is available
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: BigInt(userId) }, // Your id is BigInt in schema
          select: { email: true, phone: true },
        });
        if (user) {
          email = user.email ?? null;
          phone = user.phone ?? null;
        }
      }
    } catch {
      // Not authenticated or token invalid
      email = null;
      phone = null;
      userId = null;
    }
  }
  console.log(email, phone, userId);
  // 3. Pass to your form for autofill and to control required/disabled fields
  return (
    <div className="py-6 px-2">
      <h2 className="text-2xl font-bold mb-4 text-center">Shipping Details</h2>
      <CheckoutForm
        key={`checkout-form-${email}-${phone}-${userId}`}
        initialValues={{
          email: email ?? null,
          phone: phone ?? null,
        }}
        isLoggedIn={!!userId}
      />
      {/* ...Your cart summary here... */}
    </div>
  );
}
