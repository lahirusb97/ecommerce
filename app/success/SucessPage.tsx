"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge"; // optional
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
interface StripeLineItem {
  id: string;
  quantity: number;
  description: string;
  amount_total: number;
  price: {
    product: {
      images: string[];
      metadata?: {
        brand?: string;
        category?: string;
      };
    };
  };
}
interface StripeSession {
  id: string;
  amount_total: number;
  currency: string;
  customer_details?: {
    name?: string;
    email?: string;
  };
  line_items?: {
    data: StripeLineItem[];
  };
}
export default function SucessPage() {
  const { clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<StripeSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/stripe-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSession(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (session) clearCart();
    // Only clear when session is present, so we don’t empty the cart for accidental visits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (loading)
    return <div className="py-20 text-center">Loading your receipt…</div>;
  if (!session)
    return (
      <div className="py-20 text-center text-red-500">
        No payment info found.
      </div>
    );

  // Format amounts (Stripe is in cents)
  const formatPrice = (amount: number, currency: string) =>
    `${currency} ${(amount / 100).toLocaleString("en-LK")}`;

  return (
    <div className="max-w-2xl mx-auto mt-16 p-6 bg-white rounded-lg shadow border">
      <h1 className="text-2xl font-bold text-primary mb-2">
        Payment Successful!
      </h1>
      <p className="mb-6 text-muted-foreground">
        Thank you for your purchase. Your order details are below.
      </p>

      <div className="mb-6">
        <div className="mb-2 font-semibold">Customer:</div>
        {session.customer_details ? (
          <div>
            <div>{session.customer_details.name}</div>
            <div className="text-muted-foreground">
              {session.customer_details.email}
            </div>
          </div>
        ) : (
          <div>Customer info unavailable</div>
        )}
      </div>

      <div className="mb-6">
        <div className="mb-2 font-semibold">Order:</div>
        {session.line_items && (
          <ul className="space-y-3">
            {session.line_items.data.map((item: StripeLineItem) => (
              <li
                key={item.id}
                className="flex items-center gap-4 bg-gray-50 rounded p-2"
              >
                {item.price?.product?.images?.[0] && (
                  <Image
                    src={item.price.product.images[0]}
                    alt={item.description}
                    width={56}
                    height={56}
                    className="object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="font-semibold">{item.description}</div>
                  <div className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </div>
                  {/* Show brand, category, options if in metadata/description */}
                  {item.price.product.metadata?.brand && (
                    <Badge className="mr-1">
                      {item.price.product.metadata.brand}
                    </Badge>
                  )}
                  {item.price.product.metadata?.category && (
                    <Badge variant="outline">
                      {item.price.product.metadata.category}
                    </Badge>
                  )}
                </div>
                <div className="font-semibold text-primary">
                  {formatPrice(item.amount_total, session.currency)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t pt-4 mt-8 text-right">
        <span className="text-lg font-bold">
          Total: {formatPrice(session.amount_total, session.currency)}
        </span>
      </div>
      {/* //navigate back home  */}
      <Button
        onClick={() => router.push("/")}
        className="mt-6"
        variant="default"
      >
        Back to Shop
      </Button>
    </div>
  );
}
