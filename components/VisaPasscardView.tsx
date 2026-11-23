"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import ClubEmblem from "./ClubEmblem";
import CornerFiligree from "./CornerFiligree";
import { sounds } from "@/lib/sounds";
import {
  Download,
  Copy,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Lock,
} from "lucide-react";

interface TeamMember {
  name: string;
  email: string;
  phone?: string;
  isLeader: boolean;
  domain: string;
}

interface TeamRegistration {
  id: string;
  passcode: string;
  clubName: string;
  teamName: string;
  members: TeamMember[];
  registeredAt: string;
  domainMap: {
    webDev: string;
    cybersecurity: string;
    cloud: string;
    networking: string;
  };
}

interface VisaPasscardViewProps {
  registeredTeam: TeamRegistration;
  onReset: () => void;
  audioEnabled?: boolean;
  toggleSound?: () => void;
  onOpenOrganizer?: () => void;
}

export default function VisaPasscardView({
  registeredTeam,
  onReset,
  audioEnabled,
  toggleSound,
  onOpenOrganizer,
}: VisaPasscardViewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Guarantee instant viewport reset so user sees the top of the card with zero vertical scrolling
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Direct PNG Image Download: Direct PC save to Downloads folder, Native Share / Photos for Mobile
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

      const isMobile =
        typeof navigator !== "undefined" &&
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      // 1. Mobile Only: Web Share API (Save to Photos / WhatsApp on phone)
      if (
        isMobile &&
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

      // 2. PC / Desktop: Direct file download directly to Downloads folder (NO Windows Share popup!)
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

      // 3. Fallback for iOS in-app browsers that prevent programmatic file saves
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

  const copyCredentials = () => {
    sounds.playCardClick();
    const text = `CODERLANDS 2026 - VISA GRANTED\nTeam: ${registeredTeam.teamName} (${registeredTeam.clubName})\nTeam ID: ${registeredTeam.id}\nPasscode: ${registeredTeam.passcode}\nVenue: Seminar Hall 1 (Raman Block)`;
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-zinc-100 flex flex-col justify-between items-center py-2 px-3 sm:px-4 select-none overflow-x-hidden">
      {/* =================================================================== */}
      {/* COMPACT CENTERED CODERLANDS HEADER (NO NAVBAR)                     */}
      {/* =================================================================== */}
      <header className="flex flex-col items-center justify-center pt-1 pb-1 relative z-40">
        <div className="flex items-center gap-1.5 mb-0.5">
          <ClubEmblem size={20} />
          <span className="font-techno text-[9px] tracking-[0.25em] text-[#ff113a] font-bold uppercase">
            TECHNOVATION PRESENTS
          </span>
        </div>
        <h1 className="font-baroque text-3xl sm:text-4xl text-zinc-100 tracking-wide leading-tight drop-shadow-[0_5px_15px_rgba(255,17,58,0.4)]">
          CoderLands
        </h1>
      </header>

      {/* Main Isolated Card Arena */}
      <main className="flex-1 flex flex-col items-center justify-center my-2 sm:my-3 px-2 relative z-30 max-w-md w-full">
        {/* Animated Celebration Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-600/60 text-red-400 mb-2.5 shadow-[0_0_20px_rgba(255,17,58,0.35)]"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-sheepman tracking-[0.2em] text-[10px] sm:text-xs uppercase text-zinc-100 font-bold">
            REGISTRATION SEALED • VISA ISSUED
          </span>
        </motion.div>

        {/* =================================================================== */}
        {/* THE ROYAL VISA PASSCARD (Target for PNG capture)                    */}
        {/* =================================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 25 }}
          id="printable-visa-card"
          ref={cardRef}
          className="relative w-full max-w-[330px] sm:max-w-[350px] bg-[#fbf7ee] text-stone-900 rounded-2xl p-4 sm:p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(255,17,58,0.25)] border-2 border-[#e6dbc8] overflow-hidden"
        >
          {/* Ornate Corner Accents */}
          <CornerFiligree size={24} className="absolute top-2 left-2 text-red-900/60" />
          <CornerFiligree size={24} className="absolute top-2 right-2 -scale-x-100 text-red-900/60" />
          <CornerFiligree size={24} className="absolute bottom-2 left-2 -scale-y-100 text-red-900/60" />
          <CornerFiligree size={24} className="absolute bottom-2 right-2 rotate-180 text-red-900/60" />

          {/* Subdued Playing Card Suits Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none text-[120px] font-baroque select-none">
            ♠
          </div>

          {/* Card Header: Technovation & Team ID */}
          <div className="flex items-start justify-between border-b border-amber-900/20 pb-2 mb-2.5 relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="font-baroque text-lg text-red-600 font-bold leading-none">И</span>
              <div>
                <span className="block font-mono text-[9px] font-bold text-red-800 tracking-wider uppercase">
                  TECHNOVATION • 14 DAYS
                </span>
                <span className="block font-baroque text-sm sm:text-base font-bold text-stone-900 leading-tight">
                  CoderLands Official Pass
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="block font-mono text-xs sm:text-sm font-black text-red-700 tracking-wider">
                {registeredTeam.id}
              </span>
              <span className="block font-mono text-[8px] text-stone-500 uppercase tracking-widest">
                TEAM REG ID
              </span>
            </div>
          </div>

          {/* Team Identity Centerpiece */}
          <div className="text-center my-1.5 relative z-10">
            <h2 className="font-baroque text-2xl sm:text-3xl font-black text-stone-950 uppercase tracking-wider leading-none">
              {registeredTeam.teamName}
            </h2>
            <div className="inline-block mt-0.5 px-2 py-0.5 rounded bg-amber-900/10 text-stone-700 font-mono text-[10px] uppercase font-bold tracking-widest">
              CLUB: {registeredTeam.clubName}
            </div>
          </div>

          {/* Secure Access Passcode Box */}
          <div className="relative z-10 my-2 p-2 rounded-xl bg-stone-900 text-stone-100 border border-stone-800 shadow-inner flex items-center justify-between">
            <div>
              <span className="block text-[8px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                MAIN QUIZ ACCESS PASSCODE:
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-amber-200 tracking-widest select-all">
                {registeredTeam.passcode}
              </span>
            </div>
            <button
              onClick={copyCredentials}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 transition-colors cursor-pointer"
              title="Copy credentials"
            >
              {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* 4 Assigned Domain Squad Members */}
          <div className="grid grid-cols-2 gap-1.5 my-2 relative z-10 text-[10px]">
            <div className="p-1.5 rounded-lg bg-amber-900/10 border border-stone-300">
              <span className="font-bold text-red-900 block font-mono text-[8px] tracking-wider">
                WEBDEV:
              </span>
              <span className="font-semibold text-stone-900 truncate block">
                {registeredTeam.domainMap.webDev || "Assigned"}
              </span>
            </div>

            <div className="p-1.5 rounded-lg bg-amber-900/10 border border-stone-300">
              <span className="font-bold text-red-900 block font-mono text-[8px] tracking-wider">
                CYBERSECURITY:
              </span>
              <span className="font-semibold text-stone-900 truncate block">
                {registeredTeam.domainMap.cybersecurity || "Assigned"}
              </span>
            </div>

            <div className="p-1.5 rounded-lg bg-amber-900/10 border border-stone-300">
              <span className="font-bold text-red-900 block font-mono text-[8px] tracking-wider">
                CLOUD:
              </span>
              <span className="font-semibold text-stone-900 truncate block">
                {registeredTeam.domainMap.cloud || "Assigned"}
              </span>
            </div>

            <div className="p-1.5 rounded-lg bg-amber-900/10 border border-stone-300">
              <span className="font-bold text-red-900 block font-mono text-[8px] tracking-wider">
                NETWORKING:
              </span>
              <span className="font-semibold text-stone-900 truncate block">
                {registeredTeam.domainMap.networking || "Assigned"}
              </span>
            </div>
          </div>

          {/* Venue & Security Watermark Footer */}
          <div className="flex items-end justify-between border-t border-amber-900/25 pt-2 text-[8px] font-mono text-stone-600">
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex flex-col items-center justify-center gap-2 mt-3 max-w-[330px] sm:max-w-[350px] w-full"
        >
          {/* Download PNG Image */}
          <button
            onClick={downloadCardImage}
            disabled={isDownloading}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-sheepman tracking-wider text-xs uppercase shadow-laser flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>SAVING CARD PNG...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-amber-200" />
                <span>DOWNLOAD CARD (PNG)</span>
              </>
            )}
          </button>

          {/* Copy Full Credentials */}
          <button
            onClick={copyCredentials}
            className="w-full py-2 px-3 rounded-xl bg-black/70 border border-red-900/50 hover:border-red-600 text-zinc-300 font-mono text-[11px] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {copiedCode ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-red-400" />
                <span>COPY CREDENTIALS & PASSCODE</span>
              </>
            )}
          </button>

          {/* Register Another Squad Button */}
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors pt-0.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Register Another Team</span>
          </button>
        </motion.div>
      </main>

      {/* iOS Direct Image Preview Modal (Fail-safe for Google App on iPhone) */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="max-w-xs w-full bg-[#0e0e18] border border-red-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-laser animate-fadeIn">
            <div className="flex items-center justify-between w-full border-b border-zinc-800 pb-2 mb-2">
              <span className="font-sheepman text-[11px] text-red-400 tracking-wider uppercase font-bold">
                CARD READY • SAVE TO PHOTOS
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <img
              src={previewImage}
              alt="CoderLands Visa Card"
              className="w-full max-w-[240px] rounded-xl shadow-2xl border border-stone-400 mb-2"
            />
            <p className="text-[10px] font-mono text-zinc-300 mb-3 leading-relaxed">
              On iPhone: <strong className="text-amber-300">Touch and hold the card above</strong>, then select <strong className="text-emerald-400">"Save to Photos"</strong>.
            </p>
            <button
              onClick={() => setPreviewImage(null)}
              className="w-full py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-sheepman tracking-wider text-[11px] uppercase cursor-pointer"
            >
              DONE
            </button>
          </div>
        </div>
      )}

      {/* Compact Footer */}
      <footer className="relative z-40 text-center py-1 border-t border-red-950/40 text-[9px] font-mono text-zinc-600">
        <span>CODERLANDS 2026 • TECHNOVATION CLUB • RAMAN BLOCK</span>
      </footer>
    </div>
  );
}
