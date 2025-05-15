import z from "zod";

// Zod schema for login validation
export const schemaLogin = z.object({
  identifier: z.string().min(3), // Email or phone
  password: z.string().min(4), // Password with a minimum length of 4
});

export type SchemaLoginModel = z.infer<typeof schemaLogin>;
