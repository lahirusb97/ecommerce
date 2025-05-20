// app/admin/variant-option-values/actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createVariantOptionValue({
  optionId,
  value,
}: {
  optionId: string;
  value: string;
}) {
  await prisma.variantOptionValue.create({
    data: {
      optionId: BigInt(optionId),
      value,
    },
  });
}

export async function updateVariantOptionValue({
  id,
  optionId,
  value,
}: {
  id: string;
  optionId: number;
  value: string;
}) {
  await prisma.variantOptionValue.update({
    where: { id: Number(id) },
    data: { optionId, value },
  });
}
export async function deleteVariantOptionValue({ id }: { id: string }) {
  // 1) Remove it from the database
  await prisma.variantOptionValue.delete({
    where: { id: Number(id) },
  });

  // 2) Immediately revalidate your listing page (ISR safety)
  revalidatePath("/admin/variant-option-values");
}
