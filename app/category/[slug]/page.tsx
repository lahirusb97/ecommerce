import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";

type PageParams = Promise<{ slug: string }>;

export default async function Page({ params }: { params: PageParams }) {
  const slug = (await params).slug;

  if (!slug) {
    // No slug: show fallback UI
    return (
      <Card className="max-w-4xl mx-auto mt-10 p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <p className="mb-4 text-gray-500 text-lg">
          This category does not exist or is unavailable. Please try again
          later.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 mt-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition"
        >
          Go Home
        </Link>
      </Card>
    );
  }

  // 1. Try to find the category by slug
  const category = await prisma.category.findUnique({
    where: { slug: (await params).slug },
    select: { id: true, name: true },
  });

  if (!category) {
    // Category not found: show fallback UI
    return (
      <Card className="max-w-4xl mx-auto mt-10 p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <p className="mb-4 text-gray-500 text-lg">
          This category does not exist or is unavailable. Please try again
          later.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 mt-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition"
        >
          Go Home
        </Link>
      </Card>
    );
  }

  // 2. Get products for this category
  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: {
      category: true, // Includes the full Category object
      brand: true, // Includes the full Brand object
      variants: {
        include: {
          values: {
            include: {
              option: true, // Get the full option (e.g., Size, Color)
              value: true, // Get the value details (e.g., "Red", "XL")
            },
          },
          OrderItem: true, // Optional: get order items for each variant
        },
      },
      productCategories: {
        include: {
          category: true,
        },
      },
      OrderItem: true, // Optional: order items directly tied to product
    },
    orderBy: { createdAt: "desc" },
  });

  // 3. Render products or "no products" message
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">{category.name} Products</h1>
      {products.length === 0 ? (
        <div className="flex flex-col items-center text-gray-500 text-lg">
          <div>No items available. They will be available soon!</div>
          <Link
            href="/"
            className="inline-block px-6 py-2 mt-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition"
          >
            Go Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
