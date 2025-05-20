// app/admin/brands/page.tsx
import { prisma } from "@/lib/prisma";
import BrandList from "./BrandList";

export const metadata = {
  title: "Admin • Brands",
  description: "Create, update, or delete product brands",
};

export default async function page() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Brands</h1>
      <BrandList initialBrands={brands} />
    </div>
  );
}
