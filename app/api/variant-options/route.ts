import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwtToken";
import { schemaVariantOption } from "@/schema/schemaVariantOption";
import { prisma } from "@/lib/prisma";
import { VariantOption } from "@/lib/generated/prisma";
import isPrismaKnownRequestError from "@/lib/isPrismaKnownRequestError";

// --- POST: Create new variant option ---
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const payload = token ? await verifyJwt(token) : null;

  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schemaVariantOption.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const option = await prisma.variantOption.create({ data: parsed.data });
    return NextResponse.json(safeVariantOption(option), { status: 201 });
  } catch (error) {
    if (isPrismaKnownRequestError(error)) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Variant option with this name already exists" },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { error: "Failed to create variant option" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const options = await prisma.variantOption.findMany({
      where: name ? { name: { contains: name } } : undefined,
      orderBy: { id: "asc" },
    });
    const safeOptions = options.map(safeVariantOption);

    if (!options) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(safeOptions);
  } catch (error) {
    if (isPrismaKnownRequestError(error)) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Variant option with this name already exists" },
          { status: 409 }
        );
      }
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
function safeVariantOption(option: VariantOption) {
  return {
    ...option,
    id: option.id.toString(),
  };
}
