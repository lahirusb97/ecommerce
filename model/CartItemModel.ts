// models/CartItem.ts

/** Represents a single cart item in localStorage and React state */
export interface CartItemModel {
  productId: string; // Prisma BigInt as string (safe for localStorage)
  variantId: string; // Prisma BigInt as string
  name: string; // Product name (for display)
  price: number; // Use number for calculations (not string!)
  sku: string;
  imageUrl?: string | null;
  options: { optionName: string; value: string }[]; // e.g. [{optionName:"Color", value:"Red"}]
  quantity: number;
}
