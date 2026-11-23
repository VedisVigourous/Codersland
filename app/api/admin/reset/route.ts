import { NextRequest, NextResponse } from "next/server";
import { purgeDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizerId, passkey } = body;

    const validId =
      organizerId?.trim().toLowerCase() === "technoadmin" ||
      organizerId?.trim().toLowerCase() === "admin" ||
      organizerId?.trim().toLowerCase() === "technovation_core";

    if (!validId || passkey !== "coderland2k26") {
      return NextResponse.json(
        { error: "Unauthorized access: Invalid organizer ID or passkey." },
        { status: 401 }
      );
    }

    const result = await purgeDatabase(passkey);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Purge failed." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Arena database successfully reset to 0 registrations.",
    });
  } catch (err) {
    console.error("Admin reset API error:", err);
    return NextResponse.json({ error: "Failed to reset database." }, { status: 500 });
  }
}
