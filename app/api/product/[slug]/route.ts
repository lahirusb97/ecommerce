import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to serialize BigInt to string for JSON
function replacer(key: string, value: unknown) {
  if (typeof value === "bigint") return value.toString();
  return value;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug;

  // Fetch the product by slug
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      productCategories: { include: { category: true } },
      variants: {
        include: {
          values: {
            include: {
              option: true, // VariantOption
              value: true, // VariantOptionValue
            },
          },
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Flatten variant options for easier frontend use
  const safeProduct = {
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
  };

  return new NextResponse(JSON.stringify(safeProduct, replacer), {
    headers: { "Content-Type": "application/json" },
  });
}
