import { z } from "zod";

export const schemaSignUp = z
  .object({
    name: z.string().optional(),
    email: z.union([z.string().email(), z.literal("")]).optional(),
    phone: z.union([z.string().min(10).max(15), z.literal("")]).optional(),
    password: z.string().min(6),
  })
  .refine((data) => !!data.email || !!data.phone, {
    message: "You must provide either email or phone",
    path: ["email"],
  });

export type SchemaSignUpModel = z.infer<typeof schemaSignUp>;
