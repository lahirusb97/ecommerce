// app/api/categories/route.ts

import schemaCategory from "@/schema/schemaCategory";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";
import { Category } from "@/lib/generated/prisma";
import { verifyJwt } from "@/lib/jwtToken";

const isPrismaKnownRequestError = (
  error: unknown
): error is PrismaClientKnownRequestError => {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof (error as PrismaClientKnownRequestError).code === "string"
  );
};

export async function POST(req: NextRequest) {
  // 1) parse & validate
  const token = req.cookies.get("token")?.value;
  const payload = token ? await verifyJwt(token) : null;

  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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

    return NextResponse.json(safeCategory(newCategory), { status: 201 });
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
function safeCategory(category: Category) {
  return {
    ...category,
    id: category.id.toString(),
    parentId: category.parentId ? category.parentId.toString() : null,
  };
}
