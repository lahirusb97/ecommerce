import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export const config = {
  api: {
    bodyParser: false,
  },
};
// s
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const buf = await req.arrayBuffer();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Webhook signature verification failed", {
      status: 400,
    });
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // Metadata should include your orderId as set in your checkout code
    const orderId = session.metadata?.orderId;
    if (orderId) {
      // Update your order status to PAID, add payment info, etc.
      await prisma.order.update({
        where: { id: BigInt(orderId) },
        data: {
          status: "PAID", // Or your enum/status value
          paidAmount: session.amount_total
            ? session.amount_total / 100
            : undefined,
          paymentId: session.payment_intent as string,
          paymentMethod: session.payment_method_types?.[0] ?? "stripe",
          updatedAt: new Date(),
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
