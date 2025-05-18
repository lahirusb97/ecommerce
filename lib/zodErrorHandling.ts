import { NextResponse } from "next/server";
import { ZodError } from "zod";

//lib/zodErrorHandling.ts
export const zodErrorHandling = (error: unknown) => {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: "Validation failed", details: error.flatten() },
      { status: 400 }
    );
  }
};

// // lib/parseAndValidate.ts
// import { z, ZodSchema } from "zod";

// type ValidationResult<T> =
//   | { success: true; data: T }
//   | { success: false; error: string; details: Record<string, string[]> };

// export function parseAndValidate<T>(
//   schema: ZodSchema<T>,
//   input: unknown
// ): ValidationResult<T> {
//   const result = schema.safeParse(input);

//   if (!result.success) {
//     const formatted = result.error.flatten();
//     return {
//       success: false,
//       error: "Validation failed",
//       details: formatted.fieldErrors,
//     };
//   }

//   return { success: true, data: result.data };
// }
