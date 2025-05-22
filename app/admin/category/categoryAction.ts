// app/admin/categories/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCategory({ id }: { id: string }) {
  await prisma.category.delete({ where: { id: BigInt(id) } });
  revalidatePath("/admin/categories");
}

// (Optional) updateCategory for client-side navigation to an edit form
export async function updateCategory({
  id,
  name,
  slug,
  parentId,
}: {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}) {
  await prisma.category.update({
    where: { id: BigInt(id) },
    data: {
      name,
      slug,
      parentId: parentId ? BigInt(parentId) : null,
    },
  });
  revalidatePath("/admin/category");
}
