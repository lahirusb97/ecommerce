import { HeroCarousel } from "@/components/Herosection";
import { ProductCard } from "@/components/ProductCard";
import { ProductModel } from "@/model/ProductModels";
import React from "react";

export default async function Home() {
  const res = await fetch(`${process.env.BASE_URL}product`, {
    cache: "no-store",
  }); // "force-cache" for SSG/ISR
  const data = await res.json();
  console.log(data);
  return (
    <div>
      <HeroCarousel />
      <div className="flex flex-wrap gap-4 justify-evenly">
        {data.products.map((product: ProductModel) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
