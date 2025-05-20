// app/api/brand/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Brand as BrandModel } from "@/lib/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const nameFilter = url.searchParams.get("name")?.trim();

    const findArgs: Parameters<typeof prisma.brand.findMany>[0] = {
      orderBy: { id: "asc" },
      ...(nameFilter ? { where: { name: { contains: nameFilter } } } : {}),
    };

    const brands: BrandModel[] = await prisma.brand.findMany(findArgs);

    const safeBrands = brands.map((b) => ({
      id: b.id.toString(),
      name: b.name,
      slug: b.slug,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));

    // Always return 200 + an array, even if it's empty
    return NextResponse.json(safeBrands);
  } catch (err: unknown) {
    console.error("Error in GET /api/brands:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
