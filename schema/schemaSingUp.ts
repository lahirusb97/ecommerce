import { z } from "zod";

export const schemaSingUp = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(10).max(15).optional().or(z.literal("")),
    password: z.string().min(6),
  })
  .refine((data) => !!data.email || !!data.phone, {
    message: "You must provide either email or phone",
    path: ["email"], // or "phone" or leave empty for form-level error
  });

export type SchemaSingUpModel = z.infer<typeof schemaSingUp>;
