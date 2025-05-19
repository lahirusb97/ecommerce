import { z } from "zod";

export const schemaVariantOption = z.object({
  name: z.string().min(2, "Option name is required"),
});

export type VariantOptionInput = z.infer<typeof schemaVariantOption>;
