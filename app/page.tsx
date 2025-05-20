import { HeroParallax } from "@/components/ui/hero-parallax";
import React from "react";

export default async function Home() {
  const res = await fetch(`${process.env.BASE_URL}product`, {
    cache: "no-store",
  }); // "force-cache" for SSG/ISR
  const data = await res.json();
  console.log(data);
  return (
    <div>
      <HeroParallax products={data.products} />
      {/* {data.products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))} */}
    </div>
  );
}
