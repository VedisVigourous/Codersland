"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import ClubEmblem from "./ClubEmblem";
import CornerFiligree from "./CornerFiligree";
import { sounds } from "@/lib/sounds";
import { toPng } from "html-to-image";
import {
  Download,
  Copy,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";

interface VisaPasscardViewProps {
  registeredTeam: {
    id: string;
    passcode: string;
    teamName: string;
    clubName: string;
    domainMap: {
      webDev: string;
      cybersecurity: string;
      cloud: string;
      networking: string;
    };
    members?: Array<{
      name: string;
      isLeader: boolean;
      domain: string;
    }>;
  };
  onReset: () => void;
  audioEnabled?: boolean;
  toggleSound?: () => void;
  onOpenOrganizer?: () => void;
}

export default function VisaPasscardView({
  registeredTeam,
  onReset,
}: VisaPasscardViewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Copy registration credentials to clipboard
  const copyCredentials = () => {
    sounds.playCardClick();
    const text = `CODERLANDS 2026 - VISA GRANTED\nTeam: ${registeredTeam.teamName} (${registeredTeam.clubName})\nTeam ID: ${registeredTeam.id}\nQuiz Passcode: ${registeredTeam.passcode}\nVenue: Seminar Hall 1 (Raman Block)\nDates: 26th & 27th`;
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Direct PNG Image Download with full iPhone / WebKit iOS compatibility
  const downloadCardImage = async () => {
    if (!cardRef.current) return;
    sounds.playLaserZap();
    setIsDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 80));

      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
      });

      const filename = `CoderLands_Visa_${registeredTeam.id || "Pass"}.png`;

      // Convert dataUrl to Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/png" });

      // 1. Try iOS / Mobile Web Share API first (Native "Save Image to Photos")
      if (
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: "CoderLands Official Visa Pass",
          });
          sounds.playVisaGranted();
          setIsDownloading(false);
          return;
        } catch (shareErr: any) {
          if (shareErr.name === "AbortError") {
            setIsDownloading(false);
            return;
          }
        }
      }

      // 2. Standard Browser Blob Download
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      }, 1500);

      sounds.playVisaGranted();

      // 3. For iPhone Google App / In-App browsers that block programmatic file saves:
      const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        setPreviewImage(dataUrl);
      }
    } catch (err) {
      console.error("Failed to export card image:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-zinc-100 flex flex-col justify-between p-4 sm:p-6 select-none overflow-x-hidden">
      {/* =================================================================== */}
      {/* CENTERED CODERLANDS HEADER (NO NAVBAR)                              */}
      {/* =================================================================== */}
      <div className="flex flex-col items-center justify-center pt-2 pb-1 relative z-40">
        <div className="flex items-center gap-2 mb-1">
          <ClubEmblem size={22} />
          <span className="font-techno text-[10px] tracking-[0.25em] text-[#ff113a] font-bold uppercase">
            TECHNOVATION PRESENTS
          </span>
        </div>
        <h1 className="font-baroque text-4xl sm:text-5xl text-zinc-100 tracking-wide leading-tight drop-shadow-[0_5px_15px_rgba(255,17,58,0.4)]">
          CoderLands
        </h1>
      </div>

      {/* Main Isolated Card Arena */}
      <main className="flex-1 flex flex-col items-center justify-center my-4 sm:my-6 px-2 relative z-30">
        {/* Animated Celebration Banner */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-600/60 text-red-400 mb-4 shadow-[0_0_20px_rgba(255,17,58,0.35)]"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-sheepman tracking-[0.2em] text-xs uppercase text-zinc-100 font-bold">
            REGISTRATION SEALED • VISA ISSUED
          </span>
        </motion.div>

        {/* =================================================================== */}
        {/* THE ROYAL VISA PASSCARD (Target for PNG capture)                    */}
        {/* =================================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 25 }}
          id="printable-visa-card"
          ref={cardRef}
          className="w-full max-w-[360px] sm:max-w-[390px] rounded-2xl p-5 sm:p-6 playing-card-parchment foil-glitter shadow-2xl border-2 border-stone-400 text-stone-900 relative select-none"
        >
          {/* Top Row: Corner Indices & Header */}
          <div className="flex items-start justify-between border-b border-amber-900/30 pb-3 mb-3 relative z-20">
            <div className="flex items-center gap-2.5">
              <ClubEmblem size={26} />
              <div>
                <div className="font-techno text-[10px] text-red-800 font-black uppercase tracking-widest leading-tight">
                  TECHNOVATION • 14 DAYS
                </div>
                <div className="font-baroque text-2xl text-stone-950 leading-tight">
                  CoderLands Official Pass
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-sheepman text-xl text-red-800 font-black tracking-wide">
                {registeredTeam.id}
              </div>
              <div className="text-[9px] font-mono text-stone-600 font-bold uppercase">
                TEAM REG ID
              </div>
            </div>
          </div>

          {/* Team Moniker & Club Name */}
          <div className="text-center my-3">
            <div className="font-sheepman text-3xl sm:text-4xl text-stone-950 uppercase font-black leading-tight tracking-wide">
              {registeredTeam.teamName}
            </div>
            <div className="text-xs font-mono text-red-900 font-bold uppercase mt-0.5">
              Club: {registeredTeam.clubName}
            </div>
          </div>

          {/* Secret Quiz Access Code Box */}
          <div className="p-3 my-3 rounded-xl bg-stone-950 text-stone-100 border-2 border-red-600 shadow-md flex items-center justify-between">
            <div>
              <div className="text-[9px] font-mono text-red-400 uppercase tracking-widest font-bold">
                MAIN QUIZ ACCESS PASSCODE:
              </div>
              <div className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest">
                {registeredTeam.passcode}
              </div>
            </div>
            <button
              type="button"
              onClick={copyCredentials}
              className="p-2 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-all cursor-pointer shadow-sm active:scale-95"
              title="Copy credentials"
            >
              {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* 4 Assigned Domain Specialists Roster */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-body text-left mb-3">
            <div className="p-2 rounded-lg bg-amber-900/10 border border-stone-300">
              <span className="font-bold text-red-900 block font-mono text-[9px] tracking-wider">
                WEBDEV:
              </span>
              <span className="font-semibold text-stone-900 truncate block">
                {registeredTeam.domainMap.webDev || "Assigned"}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-amber-900/10 border border-stone-300">
              <span className="font-bold text-red-900 block font-mono text-[9px] tracking-wider">
                CYBERSECURITY:
              </span>
              <span className="font-semibold text-stone-900 truncate block">
                {registeredTeam.domainMap.cybersecurity || "Assigned"}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-amber-900/10 border border-stone-300">
              <span className="font-bold text-red-900 block font-mono text-[9px] tracking-wider">
                CLOUD:
              </span>
              <span className="font-semibold text-stone-900 truncate block">
                {registeredTeam.domainMap.cloud || "Assigned"}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-amber-900/10 border border-stone-300">
              <span className="font-bold text-red-900 block font-mono text-[9px] tracking-wider">
                NETWORKING:
              </span>
              <span className="font-semibold text-stone-900 truncate block">
                {registeredTeam.domainMap.networking || "Assigned"}
              </span>
            </div>
          </div>

          {/* Venue & Security Watermark Footer */}
          <div className="flex items-end justify-between border-t border-amber-900/25 pt-2.5 text-[9px] font-mono text-stone-600">
            <div className="flex flex-col text-left">
              <span className="font-bold text-stone-800 uppercase">VENUE: SEMINAR HALL 1</span>
              <span>Raman Block • 26th & 27th</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-bold text-red-700 uppercase">BORDERLAND VISA</span>
              <span>1 Team Visa • Active</span>
            </div>
          </div>
        </motion.div>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col items-center justify-center gap-2.5 mt-5 max-w-sm w-full"
        >
          {/* Download PNG Image */}
          <button
            onClick={downloadCardImage}
            disabled={isDownloading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-sheepman tracking-wider text-sm uppercase shadow-laser flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>SAVING CARD PNG...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-amber-200" />
                <span>DOWNLOAD CARD (PNG)</span>
              </>
            )}
          </button>

          {/* Copy Full Credentials */}
          <button
            onClick={copyCredentials}
            className="w-full py-2.5 px-4 rounded-xl bg-black/70 border border-red-900/50 hover:border-red-600 text-zinc-300 font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {copiedCode ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">CREDENTIALS COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-red-400" />
                <span>COPY CREDENTIALS & PASSCODE</span>
              </>
            )}
          </button>

          {/* Register Another Squad Button */}
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors pt-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Register Another Team</span>
          </button>
        </motion.div>
      </main>

      {/* iOS Direct Image Preview Modal (Fail-safe for Google App on iPhone) */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#0e0e18] border border-red-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-laser animate-fadeIn">
            <div className="flex items-center justify-between w-full border-b border-zinc-800 pb-2 mb-3">
              <span className="font-sheepman text-xs text-red-400 tracking-wider uppercase font-bold">
                CARD READY • SAVE TO PHOTOS
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={previewImage}
              alt="CoderLands Visa Card"
              className="w-full max-w-[280px] rounded-xl shadow-2xl border border-stone-400 mb-3"
            />
            <p className="text-[11px] font-mono text-zinc-300 mb-4 leading-relaxed">
              On iPhone: <strong className="text-amber-300">Touch and hold the card above</strong>, then select <strong className="text-emerald-400">"Save to Photos"</strong>.
            </p>
            <button
              onClick={() => setPreviewImage(null)}
              className="w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-sheepman tracking-wider text-xs uppercase cursor-pointer"
            >
              DONE
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-40 text-center py-2 border-t border-red-950/40 text-[10px] font-mono text-zinc-500">
        <span>CODERLANDS 2026 • TECHNOVATION CLUB • RAMAN BLOCK</span>
      </footer>
    </div>
  );
}
