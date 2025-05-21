import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";

// Helper to serialize BigInt to string for JSON
function replacer(key: string, value: unknown) {
  if (typeof value === "bigint") return value.toString();
  return value;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Pagination defaults
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

  // Example for filters: category, brand, search
  const categoryId = searchParams.get("categoryId");
  const brandId = searchParams.get("brandId");
  const search = searchParams.get("search");

  // Build query filter
  const where: Prisma.ProductWhereInput = {};
  if (categoryId) {
    where.categoryId = BigInt(categoryId);
  }
  if (brandId) {
    where.brandId = BigInt(brandId);
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { slug: { contains: search } },
      // Add other fields for search if needed
    ];
  }

  // Get total count for pagination
  const total = await prisma.product.count({ where });

  // Get product list with relations
  const products = await prisma.product.findMany({
    where,
    include: {
      brand: true,
      category: true,
      productCategories: { include: { category: true } },
      variants: {
        include: {
          values: {
            include: {
              option: true,
              value: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  // Optionally, map/flatten variant options
  const safeProducts = products.map((product) => ({
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      options: variant.values.map((v) => ({
        optionId: v.optionId,
        optionName: v.option.name,
        valueId: v.valueId,
        value: v.value.value,
      })),
    })),
    categories: product.productCategories.map((pc) => pc.category),
  }));

  return new NextResponse(
    JSON.stringify(
      {
        products: safeProducts,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      replacer
    ),
    { headers: { "Content-Type": "application/json" } }
  );
}
