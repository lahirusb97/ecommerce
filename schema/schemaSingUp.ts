import { z } from "zod";

export const schemaSingUp = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email(),
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  password: z.string().min(4),
});

export type SchemaSingUpModel = z.infer<typeof schemaSingUp>;
