// app/api/delete-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { deleteFile } from "@/lib/clodinary";

export async function POST(req: NextRequest) {
  const { public_id } = await req.json();
  if (!public_id) {
    return NextResponse.json(
      { error: "No public_id provided" },
      { status: 400 }
    );
  }
  try {
    await deleteFile(public_id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
