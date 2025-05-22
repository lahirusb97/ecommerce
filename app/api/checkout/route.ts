import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { hashPassword } from "@/lib/hashPassword";
import { CartItemModel } from "@/model/CartItemModel";
import { CheckoutFormModel } from "@/schema/schemaCheckoutForm";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

interface CheckoutRequestBody {
  customer: CheckoutFormModel;
  items: CartItemModel[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const { customer, items } = body;
    // 1. Parse & validate input

    // 2. Validate stock and price for all cart items
    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: BigInt(item.variantId) },
        include: { product: true },
      });
      if (!variant) {
        return NextResponse.json(
          { error: `Product variant ${item.variantId} not found.` },
          { status: 400 }
        );
      }
      if (variant.stockQty < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${variant.product.name} (SKU: ${variant.sku})`,
          },
          { status: 400 }
        );
      }
      if (Number(variant.price) !== Number(item.price)) {
        return NextResponse.json(
          {
            error: `Price mismatch for ${variant.product.name}. Please refresh your cart.`,
          },
          { status: 400 }
        );
      }
    }
    // 3. Find or create user (after validation)
    let user = await prisma.user.findUnique({
      where: { email: customer.email },
    });
    if (!user && customer.phone) {
      user = await prisma.user.findUnique({ where: { phone: customer.phone } });
    }
    //! if user not found create user password "" check
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: customer.email,
          phone: customer.phone,
          name: customer.fullName,
          password: customer.password
            ? await hashPassword(customer.password)
            : "",
        },
      });
    }
    // 4. Create Order and OrderItems (status PENDING)

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "PENDING",
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        address: [customer.address1, customer.address2]
          .filter(Boolean)
          .join(", "),
        note: "",
        items: {
          create: await Promise.all(
            items.map(async (item) => {
              const variant = await prisma.productVariant.findUnique({
                where: { id: BigInt(item.variantId) },
                include: { product: true },
              });
              if (!variant)
                throw new Error(`Product variant ${item.variantId} not found.`);
              const brand =
                variant.product.brandId &&
                (await prisma.brand.findUnique({
                  where: { id: variant.product.brandId },
                }));
              const category =
                variant.product.categoryId &&
                (await prisma.category.findUnique({
                  where: { id: variant.product.categoryId },
                }));
              return {
                productId: variant.productId,
                variantId: variant.id,
                name: variant.product.name,
                sku: variant.sku,
                price: variant.price,
                quantity: item.quantity,
                imageUrl: variant.imageUrl,
                options: item.options,
                brand:
                  brand && typeof brand === "object" && "name" in brand
                    ? brand.name
                    : null,
                category:
                  category && typeof category === "object" && "name" in category
                    ? category.name
                    : null,
              };
            })
          ),
        },
      },
      include: { items: true },
    });
    // 5. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.items.map((orderItem) => ({
        price_data: {
          currency: "lkr",
          product_data: {
            name: orderItem.name,
            description: Array.isArray(orderItem.options)
              ? orderItem.options
                  .map((opt) =>
                    typeof opt === "object" &&
                    opt !== null &&
                    "optionName" in opt
                      ? `${opt.optionName}: ${opt.value}`
                      : ""
                  )
                  .join(", ")
              : "",
            images: orderItem.imageUrl ? [orderItem.imageUrl] : [],
          },
          unit_amount: Math.round(Number(orderItem.price) * 100),
        },
        quantity: orderItem.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.BASE_URL_NO_API}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL_NO_API}/`,
      metadata: {
        orderId: order.id.toString(),
        userId: user.id.toString(),
      },
    });

    return NextResponse.json({
      url: session.url,
      orderId: order.id.toString(),
    });
  } catch (error) {
    console.error("Error in POST /api/checkout:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
