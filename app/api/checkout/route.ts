import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { CartItemModel } from "@/model/CartItemModel";

// Optional: For extra safety, create a runtime Zod schema for cart validation
// import { z } from "zod";
// const cartItemSchema = z.object({ ... });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

interface CheckoutRequestBody {
  cart: CartItemModel[];
}

export async function POST(req: NextRequest) {
  // Parse and type the request body
  const body = (await req.json()) as CheckoutRequestBody;
  const items: CartItemModel[] = body.cart;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Cart must be a non-empty array." },
      { status: 400 }
    );
  }

  // Optionally, add more runtime validation here

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "lkr",
          product_data: {
            name: item.name,
            description: item.options
              .map((opt) => `${opt.optionName}: ${opt.value}`)
              .join(", "), // e.g. "Color: Red, Size: M"
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.BASE_URL_NO_API}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL_NO_API}/`,
      // You can include metadata with IDs for order creation on webhook
      metadata: {
        cart: JSON.stringify(
          items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
