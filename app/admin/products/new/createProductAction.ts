"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { schemaCreateProduct } from "@/schema/schemaProduct";
import isPrismaKnownRequestError from "@/lib/isPrismaKnownRequestError";

export async function createProduct(
  formData: z.infer<typeof schemaCreateProduct>
) {
  try {
    // Step 1: Create the product and variants
    const product = await prisma.product.create({
      data: {
        name: formData.name,
        slug: formData.slug,
        description: formData.description ?? undefined,
        category: { connect: { id: BigInt(formData.categoryId) } },
        brand: formData.brandId
          ? { connect: { id: BigInt(formData.brandId) } }
          : undefined,
        variants: {
          create: formData.variants.map((variant) => ({
            sku: variant.sku,
            price: variant.price,
            stockQty: variant.stockQty,
            imageUrl: variant.imageUrl || undefined,
            values: {
              create: variant.values.map((v) => ({
                optionId: BigInt(v.optionId),
                valueId: BigInt(v.valueId),
              })),
            },
          })),
        },
      },
    });

    // Step 2: Create ProductCategory join entries
    if (formData.productCategoryIds && formData.productCategoryIds.length) {
      await prisma.productCategory.createMany({
        data: formData.productCategoryIds.map((catId) => ({
          productId: product.id,
          categoryId: BigInt(catId),
        })),
        skipDuplicates: true,
      });
    }

    return { success: true, data: product };
  } catch (error) {
    if (isPrismaKnownRequestError(error)) {
      //handle prisma errors
      if (error.code === "P2002") {
        return {
          success: false,
          error: { message: "A product with this slug already exists." },
        };
      }
      if (error.code === "P2003") {
        return {
          success: false,
          error: { message: "A variant with this SKU already exists." },
        };
      }
      if (error.code === "P2025") {
        return { success: false, error: { message: "Category not found." } };
      }
      if (error.code === "P2025") {
        return { success: false, error: { message: "Brand not found." } };
      }
    }
    // Fallback for any other error
    return {
      success: false,
      error: { message: "Server error. Please try again." },
    };
  }
}
