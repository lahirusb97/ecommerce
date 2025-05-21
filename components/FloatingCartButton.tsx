"use client";
import * as React from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function FloatingCartButton() {
  const [open, setOpen] = React.useState(false);
  const { cart } = useCart();
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg w-14 h-14 flex flex-col items-center justify-center gap-1 bg-primary text-white hover:bg-primary/90 transition"
        aria-label="Open cart"
      >
        <span className="text-xl">🛒</span>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
            {count}
          </span>
        )}
      </Button>
      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
