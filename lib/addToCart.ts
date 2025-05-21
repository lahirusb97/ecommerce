import { ProductModel } from "@/model/ProductModels";
import { ProductVariantModel } from "@/model/ProductModels";
import { CartItemModel } from "@/model/CartItemModel"; // <- Import the model

export function addToCart(product: ProductModel, variant: ProductVariantModel) {
  if (typeof window === "undefined") return;

  // Load existing cart and cast as CartItem[]
  const stored = localStorage.getItem("cart");
  const cart: CartItemModel[] = stored
    ? (JSON.parse(stored) as CartItemModel[])
    : [];

  // Find item by variantId
  const existingIndex = cart.findIndex((item) => item.variantId === variant.id);

  if (existingIndex > -1) {
    // Increase quantity if already in cart
    cart[existingIndex].quantity += 1;
  } else {
    // Add new CartItem
    const newItem: CartItemModel = {
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      price: parseInt(variant.price, 10), // Ensure number
      sku: variant.sku,
      imageUrl: variant.imageUrl,
      options: variant.options,
      quantity: 1,
    };
    cart.push(newItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}
