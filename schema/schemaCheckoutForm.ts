import { z } from "zod";

export const schemaCheckoutForm = z.object({
  fullName: z.string().min(2, "Enter your name"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Enter a valid phone"),
  address1: z.string().min(3, "Required"),
  address2: z.string().optional(),
  city: z.string().min(2, "Required"),
  postalCode: z.string().min(3, "Required"),
  country: z.string().min(2, "Required"),
  password: z.string().min(6, "At least 6 chars").optional(),
  createAccount: z.boolean().optional(),
});

export type CheckoutFormModel = z.infer<typeof schemaCheckoutForm>;
