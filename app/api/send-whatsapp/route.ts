import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const whatsappToken = process.env.WHATSAPP_TOKEN!;

  if (!phone) {
    return NextResponse.json(
      { success: false, error: "Phone is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v22.0/${whatsappPhoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${whatsappToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone, // E.164 format: e.g. 9477xxxxxxx (NO PLUS SIGN for WhatsApp Cloud API)
          type: "template",
          template: {
            name: "hello_world", // Must be approved in WhatsApp dashboard!
            language: { code: "en_US" },
          },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "WhatsApp API error" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, result: data });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unknown error" },
      { status: 500 }
    );
  }
}
