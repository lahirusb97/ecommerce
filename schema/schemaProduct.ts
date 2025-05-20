import { z } from "zod";

const variantValueSchema = z.object({
  optionId: z.string().min(1),
  valueId: z.string().min(1),
});

const schemaProductVariant = z.object({
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().positive("Price must be > 0"),
  stockQty: z.coerce.number().int().nonnegative("Stock ≥ 0"),
  imageUrl: z.string().url().optional(),
  publicId: z.string().optional(),
  values: z.array(variantValueSchema).min(1, "At least one option"),
});

export const schemaCreateProduct = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Select a category"),
  brandId: z.string().optional(),
  variants: z.array(schemaProductVariant).min(1, "At least one variant"),
  productCategoryIds: z.array(z.string()).optional(), // IDs as string[]
});
export type ProductVariantModel = z.infer<typeof schemaProductVariant>;
export type ProductFormModel = z.infer<typeof schemaCreateProduct>;
