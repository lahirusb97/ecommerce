import { notFound } from "next/navigation";
import ProductViewPage from "@/components/ProductViewPage";
import type { ProductModel } from "@/model/ProductModels";

type PageParams = Promise<{ slug: string }>;

// The recommended type for App Router page component
export default async function Page({ params }: { params: PageParams }) {
  const res = await fetch(
    `${process.env.BASE_URL}product/${(await params).slug}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) notFound();
  const product: ProductModel = await res.json();
  return <ProductViewPage product={product} />;
}
