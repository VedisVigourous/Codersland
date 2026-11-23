import { NextRequest, NextResponse } from "next/server";
import { getRegistrations, findTeamById } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId");
  const passcode = searchParams.get("passcode");
  const domain = searchParams.get("domain"); // e.g. "Cloud"

  const allTeams = await getRegistrations();

  // If credentials provided for Quiz authentication
  if (teamId || passcode) {
    const matched = allTeams.find(
      (t) =>
        (!teamId || t.id.toLowerCase() === teamId.toLowerCase()) &&
        (!passcode || t.passcode.toLowerCase() === passcode.toLowerCase())
    );

    if (!matched) {
      return NextResponse.json({ error: "Invalid Team ID or Passcode" }, { status: 401 });
    }

    // Determine current domain representative
    let activePlayer = null;
    if (domain) {
      const member = matched.members.find(
        (m) => m.domain.toLowerCase() === domain.toLowerCase()
      );
      activePlayer = member ? member.name : null;
    }

    return NextResponse.json({
      authenticated: true,
      teamId: matched.id,
      teamName: matched.teamName,
      clubName: matched.clubName,
      members: matched.members,
      domainMap: matched.domainMap,
      activePlayerForDomain: activePlayer,
    });
  }

  // Return public team list for leaderboard / check-in
  return NextResponse.json({
    totalTeams: allTeams.length,
    teams: allTeams.map((t) => ({
      id: t.id,
      teamName: t.teamName,
      clubName: t.clubName,
      status: t.status,
      domainMap: t.domainMap,
    })),
  });
}
