import { NextResponse } from "next/server";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export function handlePrismaError(error: unknown) {
  console.error("Prisma Error:", error);

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = (error.meta?.target as string[]) || [];
      const field = target.length > 0 ? `Field: ${target.join(", ")}` : "";
      return NextResponse.json(
        {
          error: `A record with this ${field} already exists.`,
          code: error.code,
          meta: error.meta,
        },
        { status: 409 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Record not found.",
          code: error.code,
          meta: error.meta,
        },
        { status: 404 }
      );
    }
  }

  if (error instanceof PrismaClientValidationError) {
    return NextResponse.json(
      {
        error: "Validation error. Please check your input data.",
        details: error.message.split("\n").slice(1).join(" ").trim(),
      },
      { status: 400 }
    );
  }

  // For other types of errors
  return NextResponse.json(
    {
      error: "An unexpected error occurred",
      details: error instanceof Error ? error.message : "Unknown error",
    },
    { status: 500 }
  );
}
