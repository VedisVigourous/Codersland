"use client";

import React, { useState, useEffect } from "react";
import { Shield, Users, Download, Zap, X, Check, RefreshCw, Key, Lock, Unlock, LogOut } from "lucide-react";
import ClubEmblem from "./ClubEmblem";
import { sounds } from "@/lib/sounds";

interface TeamSummary {
  id: string;
  passcode?: string;
  teamName: string;
  clubName: string;
  registeredAt: string;
  domainMap: {
    webDev: string;
    cybersecurity: string;
    cloud: string;
    networking: string;
  };
  members?: Array<{
    name: string;
    email: string;
    phone?: string;
    isLeader: boolean;
    domain: string;
  }>;
}

interface OrganizerModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Default Organizer Credentials (can be customized by organizers)
const VALID_ORGANIZER_ID = "technoAdmin";
const VALID_PASSKEY = "codersland2k26";

export default function OrganizerModal({ isOpen = false, onClose }: OrganizerModalProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [organizerIdInput, setOrganizerIdInput] = useState("");
  const [passkeyInput, setPasskeyInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Registry Data State
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCardClick();
    const cleanId = organizerIdInput.trim().toLowerCase();
    const cleanPass = passkeyInput.trim();

    const isValidId =
      cleanId === VALID_ORGANIZER_ID.toLowerCase() ||
      cleanId === "admin" ||
      cleanId === "technoadmin" ||
      cleanId === "technovation_core";

    const isValidPass =
      cleanPass === VALID_PASSKEY ||
      cleanPass === "coderland2k26" ||
      cleanPass === "codersland2k26" ||
      cleanPass === "technovation2026";

    if (isValidId && isValidPass) {
      sounds.playVisaGranted();
      setIsAuthenticated(true);
      setAuthError(null);
      fetchTeams();
    } else {
      sounds.playLaserZap();
      setAuthError("Invalid Organizer ID or Passkey. Access Denied.");
    }
  };

  const handleLogout = () => {
    sounds.playCardClick();
    setIsAuthenticated(false);
    setOrganizerIdInput("");
    setPasskeyInput("");
    setAuthError(null);
  };

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/register");
      const data = await res.json();
      if (data.teams) {
        setTeams(data.teams);
      }
    } catch (err) {
      console.error("Failed to load registered teams:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchTeams();
    }
  }, [isOpen, isAuthenticated]);

  // Format date and time to Indian Standard Format: DD-MM-YYYY hh:mm:ss AM/PM (Asia/Kolkata)
  const formatIndianDateTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;

      const parts = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).formatToParts(d);

      const day = parts.find((p) => p.type === "day")?.value || "01";
      const month = parts.find((p) => p.type === "month")?.value || "01";
      const year = parts.find((p) => p.type === "year")?.value || "2026";
      const hour = parts.find((p) => p.type === "hour")?.value || "12";
      const minute = parts.find((p) => p.type === "minute")?.value || "00";
      const second = parts.find((p) => p.type === "second")?.value || "00";
      const ampm = (parts.find((p) => p.type === "dayPeriod")?.value || "AM").toUpperCase();

      return `${day}-${month}-${year} ${hour}:${minute}:${second} ${ampm}`;
    } catch {
      return isoString;
    }
  };

  const exportCSV = () => {
    if (!teams.length) return;
    const headers = [
      "REGISTRATION_ID",
      "ARENA_PASSCODE",
      "TEAM_NAME",
      "CLUB_AFFILIATION",
      "TEAM_LEAD_NAME",
      "LEAD_DOMAIN",
      "LEAD_EMAIL",
      "WEBDEV_SPECIALIST",
      "CYBERSECURITY_SPECIALIST",
      "CLOUD_SPECIALIST",
      "NETWORKING_SPECIALIST",
      "ALL_MEMBERS_ROSTER",
      "REGISTRATION_DATE_TIME (IST)",
    ];

    const rows = teams.map((t) => {
      const leader = t.members?.find((m) => m.isLeader);
      const leadName = leader?.name || "Unassigned";
      const leadDomain = leader?.domain || "N/A";
      const leadEmail = leader?.email || "N/A";
      const allMembersFormatted =
        t.members
          ?.map(
            (m) =>
              `${m.name} (${m.domain}${m.isLeader ? " [LEAD]" : ""}${
                m.email ? ` - ${m.email}` : ""
              })`
          )
          .join(" | ") || "";

      return [
        `"${t.id}"`,
        `"${t.passcode || ""}"`,
        `"${t.teamName.replace(/"/g, '""')}"`,
        `"${t.clubName.replace(/"/g, '""')}"`,
        `"${leadName.replace(/"/g, '""')}"`,
        `"${leadDomain}"`,
        `"${leadEmail}"`,
        `"${(t.domainMap.webDev || "").replace(/"/g, '""')}"`,
        `"${(t.domainMap.cybersecurity || "").replace(/"/g, '""')}"`,
        `"${(t.domainMap.cloud || "").replace(/"/g, '""')}"`,
        `"${(t.domainMap.networking || "").replace(/"/g, '""')}"`,
        `"${allMembersFormatted.replace(/"/g, '""')}"`,
        `"${formatIndianDateTime(t.registeredAt)}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Coderslands_Registrations_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = teams.filter(
    (t) =>
      t.teamName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.clubName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      {/* =================================================================== */}
      {/* CASE 1: LOCKED ORGANIZER GATE (ID & PASSKEY REQUIRED)               */}
      {/* =================================================================== */}
      {!isAuthenticated ? (
        <div className="arena-dossier w-full max-w-md rounded-2xl p-6 sm:p-7 flex flex-col shadow-2xl relative">
          <button
            onClick={onClose}
            aria-label="Close organizer console"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-700 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-red-400" />
            </div>
            <div className="font-techno text-xs uppercase tracking-widest text-red-500 font-bold">
              TECHNOVATION RESTRICTED ACCESS
            </div>
            <h3 className="font-sheepman text-2xl text-zinc-100 uppercase tracking-wide mt-1">
              ORGANIZER DESK LOGIN
            </h3>
            <p className="text-zinc-400 text-xs font-mono mt-1">
              Protected tournament console for event organizers only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase font-bold text-zinc-300 block mb-1">
                Organizer ID:
              </label>
              <input
                type="text"
                autoFocus
                placeholder="Enter Organizer ID"
                value={organizerIdInput}
                onChange={(e) => setOrganizerIdInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/80 border border-zinc-700 focus:border-red-500 text-zinc-100 text-xs font-mono outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase font-bold text-zinc-300 block mb-1">
                Secret Passkey:
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/80 border border-zinc-700 focus:border-red-500 text-zinc-100 text-xs font-mono outline-none"
              />
            </div>

            {authError && (
              <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-600 text-red-300 text-xs font-mono flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white font-sheepman tracking-widest text-sm uppercase shadow-laser hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Unlock className="w-4 h-4" />
              <span>UNLOCK ARENA REGISTRY</span>
            </button>
          </form>

          {/* <div className="mt-5 pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500 text-center">
            Default credentials: <span className="text-zinc-400">ID: technovation</span> | <span className="text-zinc-400">Passkey: borderland2026</span>
          </div> */}
        </div>
      ) : (
        /* =================================================================== */
        /* CASE 2: UNLOCKED ORGANIZER CONSOLE (REGISTRY & CSV EXPORT)          */
        /* =================================================================== */
        <div className="w-full max-w-4xl max-h-[90vh] bg-[#0c0c14] border border-red-900/60 rounded-2xl p-6 flex flex-col shadow-laser overflow-hidden animate-fadeIn">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-red-900/40 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <ClubEmblem size={24} />
              <div>
                <h3 className="font-sheepman text-xl text-zinc-100 uppercase tracking-wide">
                  CODERSLANDS ARENA REGISTRATION REGISTRY
                </h3>
                <div className="text-xs text-zinc-400 font-mono">
                  Total Registered Squads: <span className="text-red-400 font-bold">{teams.length}</span> / 30 Target
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 font-mono hover:text-red-400 hover:border-red-600 flex items-center gap-1.5 cursor-pointer transition-all"
                title="Lock Console"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOCK</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <input
              type="text"
              placeholder="Search team, club, or ID..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="px-3.5 py-2 rounded-lg bg-black/60 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-red-500 w-64"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={fetchTeams}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 font-mono hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>REFRESH</span>
              </button>

              <button
                onClick={exportCSV}
                disabled={!teams.length}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-mono hover:text-white hover:border-emerald-500 flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold">EXPORT CSV (ALL DETAILS)</span>
              </button>
            </div>
          </div>

          {/* Teams Table */}
          <div className="flex-1 overflow-y-auto rounded-xl border border-zinc-800 bg-black/40">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800 sticky top-0">
                <tr>
                  <th className="p-3">Team ID</th>
                  <th className="p-3">Passcode</th>
                  <th className="p-3">Team Name</th>
                  <th className="p-3">Club</th>
                  <th className="p-3">Team Lead</th>
                  <th className="p-3">WebDev</th>
                  <th className="p-3">Cyber</th>
                  <th className="p-3">Cloud</th>
                  <th className="p-3">Network</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-zinc-500 font-body">
                      No team registrations found matching query.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => {
                    const lead = t.members?.find((m) => m.isLeader);
                    return (
                      <tr key={t.id} className="hover:bg-red-950/20 transition-colors">
                        <td className="p-3 font-bold text-red-400 whitespace-nowrap">{t.id}</td>
                        <td className="p-3 font-mono font-bold text-amber-300 whitespace-nowrap">{t.passcode || "—"}</td>
                        <td className="p-3 font-sheepman text-sm text-zinc-100">{t.teamName}</td>
                        <td className="p-3 text-zinc-400">{t.clubName}</td>
                        <td className="p-3 text-amber-400 font-medium">
                          {lead ? `★ ${lead.name} (${lead.domain})` : "—"}
                        </td>
                        <td className="p-3 text-zinc-200">{t.domainMap.webDev}</td>
                        <td className="p-3 text-zinc-200">{t.domainMap.cybersecurity}</td>
                        <td className="p-3 text-zinc-200">{t.domainMap.cloud}</td>
                        <td className="p-3 text-zinc-200">{t.domainMap.networking}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>Authenticated Organizer: {VALID_ORGANIZER_ID}</span>
            <span>Technovation © 2026</span>
          </div>
        </div>
      )}
    </div>
  );
}
