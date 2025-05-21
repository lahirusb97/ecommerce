import { notFound } from "next/navigation";
import ProductViewPage from "@/components/ProductViewPage";
import type { ProductModel } from "@/model/ProductModels";

type Params = { slug: string };

// The recommended type for App Router page component
export default async function Page({ params }: { params: Params }) {
  const res = await fetch(`${process.env.BASE_URL}product/${params.slug}`, {
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const product: ProductModel = await res.json();
  return <ProductViewPage product={product} />;
}
