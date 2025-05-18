import { z } from "zod";

const schemaCategory = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: z.number().optional(),
});

export default schemaCategory;

//schema ts model
export type CategoryFormModel = z.infer<typeof schemaCategory>;
