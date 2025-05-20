import { ProductCard } from "@/components/ProductCard";
import { ProductModel } from "@/model/ProductModels";
import React from "react";

export default async function page() {
  const res = await fetch(`${process.env.BASE_URL}product`, {
    cache: "no-store",
  }); // "force-cache" for SSG/ISR
  const data = await res.json();
  console.log(data);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.products.map((product: ProductModel) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
