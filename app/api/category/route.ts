// app/api/categories/route.ts

import schemaCategory from "@/schema/schemaCategory";
import { NextResponse } from "next/server";
import {
  PrismaClientKnownRequestError,
  // PrismaClientUnknownRequestError,
  // PrismaClientRustPanicError,
  // PrismaClientInitializationError,
  // PrismaClientValidationError,
} from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";

const isPrismaKnownRequestError = (
  error: unknown
): error is PrismaClientKnownRequestError => {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof (error as PrismaClientKnownRequestError).code === "string"
  );
};

export async function POST(req: Request) {
  // 1) parse & validate
  const body = await req.json();
  const parsed = schemaCategory.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    // 2) attempt creation
    const { name, slug, parentId } = parsed.data;
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        parentId: parentId ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: unknown) {
    if (isPrismaKnownRequestError(error)) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Category with this slug or name already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 400 }
      );
    }

    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topOnly = searchParams.get("top") === "true";

  const categories = await prisma.category.findMany({
    where: topOnly ? { parentId: null } : {},
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}
