import { NextRequest, NextResponse } from "next/server";
import { schemaVariantOption } from "@/schema/schemaVariantOption";
import { prisma } from "@/lib/prisma";
import isPrismaKnownRequestError from "@/lib/isPrismaKnownRequestError";
import { verifyJwt } from "@/lib/jwtToken";

// --- PATCH: Update variant option ---
export async function PATCH(
  req: NextRequest,
  { params }: { params: { variant_id: string } }
) {
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
    const updated = await prisma.variantOption.update({
      where: { id: BigInt(params.variant_id) },
      data: parsed.data,
    });
    return NextResponse.json({ ...updated, id: updated.id.toString() });
  } catch (error) {
    if (isPrismaKnownRequestError(error)) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Variant option not found" },
          { status: 404 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Variant option is used by a product" },
          { status: 400 }
        );
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Variant option with this name already exists" },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { error: "Failed to update variant option" },
      { status: 500 }
    );
  }
}

// --- DELETE: Remove variant option ---
export async function DELETE(
  req: NextRequest,
  { params }: { params: { variant_id: string } }
) {
  const token = req.cookies.get("token")?.value;
  const payload = token ? await verifyJwt(token) : null;

  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.variantOption.delete({
      where: { id: BigInt(params.variant_id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isPrismaKnownRequestError(error)) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Variant option not found" },
          { status: 404 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Variant option is used by a product" },
          { status: 400 }
        );
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Variant option with this name already exists" },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { error: "Failed to delete variant option" },
      { status: 500 }
    );
  }
}
