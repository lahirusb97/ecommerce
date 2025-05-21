"use client";

import { useCart } from "@/context/CartContext";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area"; // (optional for scrollable content)
import { Minus, Plus } from "lucide-react";

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });
    const data = await res.json();
    if (data.url) {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } else {
      alert(data.error || "Failed to start checkout.");
    }
  };
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-lg mx-auto">
        <DrawerHeader>
          <DrawerTitle>Shopping Cart</DrawerTitle>
          {cart.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCart}>
              Clear Cart
            </Button>
          )}
        </DrawerHeader>
        <ScrollArea className="h-[350px] px-4">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground my-8">
              Your cart is empty.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.variantId}
                  className="flex items-center gap-2 bg-muted/50 rounded-lg p-2"
                >
                  <div className="w-14 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={56}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground mb-1">
                      SKU: <span className="font-mono">{item.sku}</span>
                    </div>
                    {item.options?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.options.map((opt, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {opt.optionName}: {opt.value}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-sm text-primary font-bold">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        disabled={item.quantity === 1}
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Minus />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        x{item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFromCart(item.variantId)}
                    aria-label="Remove"
                  >
                    <span aria-hidden>✕</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <DrawerFooter className="mt-4">
          <div className="flex justify-between items-center mb-3 px-2">
            <span className="font-semibold">Total:</span>
            <span className="text-primary font-bold text-lg">
              Rs. {total.toLocaleString()}
            </span>
          </div>
          <Button
            className="w-full"
            disabled={cart.length === 0}
            onClick={() => handleCheckout()}
            variant="default"
          >
            Checkout
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
