// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import { ProductModel } from "@/model/ProductModels";
import ProductViewPage from "@/components/ProductViewPage";

export default async function Page({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.BASE_URL}product/${params.slug}`, {
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const product: ProductModel = await res.json();
  // Pass product as prop, unmodified
  return <ProductViewPage product={product} />;
}
