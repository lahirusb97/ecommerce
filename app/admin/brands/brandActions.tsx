"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import isPrismaKnownRequestError from "@/lib/isPrismaKnownRequestError";

type BrandInput = {
  id?: string;
  name: string;
  slug: string;
};

export async function createBrand({ name, slug }: BrandInput) {
  try {
    await prisma.brand.create({ data: { name, slug } });
    revalidatePath("/admin/brands");
    return { success: true };
  } catch (error: unknown) {
    // 1) Filter down to Prisma-known errors
    if (isPrismaKnownRequestError(error)) {
      // 2) Unique‐constraint violation
      if (error.code === "P2002") {
        return {
          success: false,
          error: "That slug is already in use. Please choose another.",
        };
      }
    }
    // 3) Fallback for anything else
    return {
      success: false,
      error: "Failed to create brand. Please try again.",
    };
  }
}

export async function updateBrand({ id, name, slug }: BrandInput) {
  try {
    await prisma.brand.update({
      where: { id: BigInt(id!) },
      data: { name, slug },
    });
    revalidatePath("/admin/brands");
  } catch (error: unknown) {
    if (isPrismaKnownRequestError(error)) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: "That slug is already in use. Please choose another.",
        };
      }
    }
    return {
      success: false,
      error: "Failed to update brand. Please try again.",
    };
  }
}

export async function deleteBrand({ id }: { id: string }) {
  try {
    await prisma.brand.delete({ where: { id: BigInt(id) } });
    revalidatePath("/admin/brands");
  } catch (error: unknown) {
    if (isPrismaKnownRequestError(error)) {
      // Record-not-found or foreign-key violation
      if (error.code === "P2025") {
        return { success: false, error: "This brand no longer exists." };
      }
    }
    return {
      success: false,
      error: "Failed to delete brand. Please try again.",
    };
  }
}
