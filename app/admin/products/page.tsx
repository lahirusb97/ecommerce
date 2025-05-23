import { ProductCard, ProductWithAllRelations } from "@/components/ProductCard";

import React from "react";

export default async function page() {
  const res = await fetch(`${process.env.BASE_URL}product`, {
    cache: "no-store",
  }); // "force-cache" for SSG/ISR
  const data = await res.json();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.products.map((product: ProductWithAllRelations) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
