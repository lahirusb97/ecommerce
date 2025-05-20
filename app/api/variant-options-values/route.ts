import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Helper function to serialize BigInt IDs to string, recursively for nested structures
interface VariantOptionList {
  id: bigint;
  name: string;
  values: {
    id: bigint;
    optionId: bigint;
    value: string;
  }[];
}
function serializeVariantOptions(data: VariantOptionList[]) {
  return data.map((variantOption) => ({
    id: variantOption.id.toString(),
    name: variantOption.name,
    values: variantOption.values.map((value) => ({
      id: value.id.toString(),
      optionId: value.optionId.toString(),
      value: value.value,
    })),
  }));
}

export async function GET() {
  try {
    const variantOptions = await prisma.variantOption.findMany({
      include: {
        values: {
          include: {
            variantValues: true, // this is ProductVariantValue[]
          },
        },
      },
    });

    const safeData = serializeVariantOptions(variantOptions);

    return NextResponse.json(safeData);
  } catch (error) {
    console.error("Error fetching variant options:", error);
    return NextResponse.json(
      { error: "Failed to fetch variant options" },
      { status: 500 }
    );
  }
}
