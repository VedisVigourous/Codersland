import { NextRequest, NextResponse } from "next/server";
import { registerTeam, getRegistrations, checkRateLimit } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    // 1. Anti-Bot Honeypot trap check
    if (body.website || body.honeypot || body.trap) {
      return NextResponse.json(
        { error: "Security check triggered. Automated submission rejected." },
        { status: 400 }
      );
    }

    // 2. IP Rate Limiter (Max 3 submissions per 3 minutes per IP)
    const rateCheck = await checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Too many requests from your IP. Please wait ${rateCheck.retryAfter || 180} seconds before attempting another registration.`,
        },
        { status: 429 }
      );
    }

    const result = await registerTeam({
      ...body,
      ipAddress: ip,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Registration rejected by Coderlands." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "VISA_GRANTED: Application approved for Coderlands arena.",
      team: result.team,
    });
  } catch (err: any) {
    console.error("API error during team registration:", err);
    return NextResponse.json(
      { error: "Internal arena server anomaly. Submission safely held." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const teams = await getRegistrations();
    // Return complete registration details for authenticated organizer export
    return NextResponse.json({
      count: teams.length,
      teams: teams.map((t) => ({
        id: t.id,
        passcode: t.passcode,
        teamName: t.teamName,
        clubName: t.clubName,
        registeredAt: t.registeredAt,
        domainMap: t.domainMap,
        members: t.members,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to read registrations." }, { status: 500 });
  }
}
