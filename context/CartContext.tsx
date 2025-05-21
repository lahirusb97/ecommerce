// app/context/CartContext.tsx
"use client";
import { CartItemModel } from "@/model/CartItemModel";
import { ProductModel, ProductVariantModel } from "@/model/ProductModels";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CartContextType {
  cart: CartItemModel[];
  addToCart: (
    item: ProductModel,
    qty: number,
    variant: ProductVariantModel
  ) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  updateQuantity: (variantId: string, qty: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
// Correctly typed type guard: returns obj is CartItem
function isCartItem(obj: unknown): obj is CartItemModel {
  // Check object shape and required fields
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as CartItemModel).productId === "string" &&
    typeof (obj as CartItemModel).variantId === "string" &&
    typeof (obj as CartItemModel).name === "string" &&
    typeof (obj as CartItemModel).price === "number" &&
    typeof (obj as CartItemModel).sku === "string" &&
    typeof (obj as CartItemModel).quantity === "number"
  );
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItemModel[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr) && arr.every(isCartItem)) {
          setCart(arr);
        } else {
          setCart([]);
        }
      } catch {
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    item: ProductModel,
    qty = 1,
    variant: ProductVariantModel
  ) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.variantId === variant.id);
      if (existing) {
        // Increase quantity
        return prev.map((i) =>
          i.variantId === variant.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      // Only use the required fields for CartItemModel!
      const newItem: CartItemModel = {
        productId: item.id,
        variantId: variant.id,
        name: item.name,
        price: parseInt(variant.price, 10),
        sku: variant.sku,
        imageUrl: variant.imageUrl,
        options: variant.options,
        quantity: qty,
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart"); //clear cart from localStorage
  };

  const updateQuantity = (variantId: string, qty: number) => {
    setCart((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity: qty } : i))
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
