"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClubEmblem from "./ClubEmblem";
import TiltCard3D from "./TiltCard3D";
import { sounds } from "@/lib/sounds";
import confetti from "canvas-confetti";
import {
  Crown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  ExternalLink,
  Shield,
  Flame,
  Zap,
} from "lucide-react";

export type DomainType = "Web Development" | "Cybersecurity" | "Cloud" | "Networking";

export interface MemberData {
  name: string;
  email: string;
  phone: string;
  isLeader: boolean;
  domain: DomainType;
}

const DOMAIN_OPTIONS: { id: DomainType; label: string; icon: string; suit: string }[] = [
  { id: "Web Development", label: "Web Development", icon: "🌐", suit: "♠" },
  { id: "Cybersecurity", label: "Cybersecurity", icon: "🛡️", suit: "♣" },
  { id: "Cloud", label: "Cloud Computing", icon: "☁️", suit: "♦" },
  { id: "Networking", label: "Networking", icon: "🔗", suit: "♥" },
];

const POPULAR_CLUBS = [
  "Technovation",
  "ACM Student Chapter",
  "IEEE Computer Society",
  "GDSC / GDG",
  "CSI Chapter",
  "CodeChef Campus",
  "Rotaract Tech",
  "CyberOps Syndicate",
];

const SLIDE_TITLES = [
  "01 // ARENA BRIEFING",
  "02 // IDENTITY PAIR",
  "03 // SQUAD ALPHA (WEB & CYBER)",
  "04 // SQUAD BRAVO (CLOUD & NET)",
  "05 // VISA CLEARANCE",
];

export default function Cinematic3DStage() {
  // Current Slide (0 = Home Deck, 1 = Club & Team, 2 = Members 1 & 2, 3 = Members 3 & 4, 4 = Visa Passport)
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Slide 1: Focused Card ('club' or 'team')
  const [focusedCard1, setFocusedCard1] = useState<"club" | "team">("club");

  // Slide 2: Focused Member (0 = WebDev, 1 = Cyber)
  const [focusedMemberSlide2, setFocusedMemberSlide2] = useState<0 | 1>(0);

  // Slide 3: Focused Member (2 = Cloud, 3 = Networking)
  const [focusedMemberSlide3, setFocusedMemberSlide3] = useState<2 | 3>(2);

  // Form State
  const [clubName, setClubName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<MemberData[]>([
    { name: "", email: "", phone: "", isLeader: true, domain: "Web Development" },
    { name: "", email: "", phone: "", isLeader: false, domain: "Cybersecurity" },
    { name: "", email: "", phone: "", isLeader: false, domain: "Cloud" },
    { name: "", email: "", phone: "", isLeader: false, domain: "Networking" },
  ]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredTeam, setRegisteredTeam] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Member update handler
  const updateMember = (index: number, field: keyof MemberData, value: any) => {
    setMembers((prev) => {
      const updated = [...prev];
      if (field === "isLeader" && value === true) {
        updated.forEach((m, i) => {
          m.isLeader = i === index;
        });
      } else if (field === "domain") {
        const targetDomain = value as DomainType;
        const prevOwnerIdx = updated.findIndex((m, i) => i !== index && m.domain === targetDomain);
        if (prevOwnerIdx !== -1) {
          updated[prevOwnerIdx].domain = updated[index].domain;
        }
        updated[index].domain = targetDomain;
      } else {
        (updated[index] as any)[field] = value;
      }
      return updated;
    });
  };

  // Change Slide with 3D Motion Swoosh
  const goToSlide = useCallback(
    (target: number) => {
      if (isTransitioning || target < 0 || target > 4) return;
      setIsTransitioning(true);
      sounds.playCardSwoosh();
      setCurrentSlide(target);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 650);
    },
    [isTransitioning]
  );

  // Wheel Scroll Navigation Listener (Continuous Motion Slide by Slide)
  const wheelLockRef = useRef(false);
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (wheelLockRef.current) return;
      if (Math.abs(e.deltaY) > 40) {
        wheelLockRef.current = true;
        if (e.deltaY > 0) {
          goToSlide(currentSlide + 1);
        } else {
          goToSlide(currentSlide - 1);
        }
        setTimeout(() => {
          wheelLockRef.current = false;
        }, 850);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        goToSlide(currentSlide + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        goToSlide(currentSlide - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, goToSlide]);

  // Submit Registration to API
  const handleSubmitRegistration = async () => {
    if (!clubName.trim()) {
      setErrorMessage("Club Name is required on Slide 2.");
      goToSlide(1);
      return;
    }
    if (!teamName.trim()) {
      setErrorMessage("Team Name is required on Slide 2.");
      goToSlide(1);
      return;
    }
    for (let i = 0; i < 4; i++) {
      if (!members[i].name.trim()) {
        setErrorMessage(`Member #${i + 1} name is missing. Please complete all 4 cards.`);
        goToSlide(i < 2 ? 2 : 3);
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    sounds.playLaserZap();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clubName: clubName.trim(),
          teamName: teamName.trim(),
          members: members.map((m) => ({
            name: m.name.trim(),
            email: m.email.trim(),
            phone: m.phone.trim(),
            isLeader: m.isLeader,
            domain: m.domain,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Borderland arena server rejected registration.");
      }

      setRegisteredTeam(data.team);
      sounds.playVisaGranted();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ["#ff113a", "#d6001c", "#f4ede0", "#c5a059"],
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to register. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCredentials = () => {
    if (!registeredTeam) return;
    const text = `CODERLANDS 2026 - VISA GRANTED\nTeam: ${registeredTeam.teamName} (${registeredTeam.clubName})\nTeam ID: ${registeredTeam.id}\nPasscode: ${registeredTeam.passcode}\nVenue: Seminar Hall 1 (Raman Block)`;
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none scene-3d flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* ===================================================================== */}
      {/* TOP DOCK: HEADER & DETAILS CONTAINER (MATCHING SKETCHUP)               */}
      {/* ===================================================================== */}
      <header className="relative z-50 flex items-center justify-between w-full max-w-6xl mx-auto border-b border-red-900/30 pb-3">
        {/* Left: Club Presenter */}
        <div className="flex items-center gap-3">
          <ClubEmblem size={24} />
          <div>
            <div className="font-techno text-[10px] sm:text-xs tracking-[0.2em] text-[#ff113a] font-bold">
              TECHNOVATION PRESENTS
            </div>
            <div className="font-baroque text-xl sm:text-2xl text-zinc-100 tracking-wide">
              CoderLands
            </div>
          </div>
        </div>

        {/* Center: Slide Stage Tracker */}
        <div className="hidden md:flex items-center gap-2 bg-black/60 border border-red-950/80 px-4 py-1.5 rounded-full backdrop-blur-md">
          {SLIDE_TITLES.map((title, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all ${
                currentSlide === i
                  ? "bg-red-700 text-white font-bold shadow-[0_0_10px_#ff113a]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {title.split("//")[1].trim()}
            </button>
          ))}
        </div>

        {/* Right: Quick Slide Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="w-8 h-8 rounded-full bg-black/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600 disabled:opacity-20 flex items-center justify-center transition-all"
            title="Previous Slide"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => goToSlide(currentSlide + 1)}
            disabled={currentSlide === 4}
            className="w-8 h-8 rounded-full bg-black/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600 disabled:opacity-20 flex items-center justify-center transition-all"
            title="Next Slide"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Error alert toast */}
      {errorMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-red-950/90 border border-red-600 text-red-200 text-xs font-mono flex items-center gap-2 backdrop-blur-md shadow-laser animate-shake">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3D MOTION STAGE: FULL SCREEN CARDS VIEWPORT                          */}
      {/* ===================================================================== */}
      <main className="relative flex-1 w-full max-w-6xl mx-auto flex items-center justify-center preserve-3d">
        <AnimatePresence mode="wait">
          {/* ----------------------------------------------------------------- */}
          {/* SLIDE 0: ARENA ENTRY DECK (EXACTLY MATCHING EXCALIDRAW SKETCH 1)   */}
          {/* ----------------------------------------------------------------- */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, scale: 0.85, z: -400 }}
              animate={{ opacity: 1, scale: 1, z: 0 }}
              exit={{
                opacity: 0,
                scale: 1.25,
                z: 400,
                filter: "blur(14px) contrast(180%)",
                transition: { duration: 0.6 },
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex flex-col justify-between py-2 sm:py-4"
            >
              {/* Center Top Horizontal Details Card */}
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="w-full max-w-2xl mx-auto rounded-xl p-4 bg-black/60 border border-red-900/50 backdrop-blur-md text-center shadow-lg"
              >
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#ff113a] uppercase tracking-widest font-bold mb-1">
                  <Flame className="w-3.5 h-3.5 animate-pulse" />
                  <span>INTER-CLUB SURVIVAL TOURNAMENT • 26TH & 27TH</span>
                </div>
                <h1 className="font-baroque text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500">
                  CoderLands Arena
                </h1>
                <p className="text-zinc-400 text-xs font-body mt-1">
                  Seminar Hall 1, Raman Block • 4 Locked Domains • 1 Team Visa
                </p>
              </motion.div>

              {/* Main Arena Cards Row: Left Tall Card + Center Fanned Deck + Right Tall Card */}
              <div className="relative w-full flex-1 flex items-center justify-between gap-4 my-2 px-2">
                {/* Left Tall Card: ROUND 1 FOURFOLD */}
                <TiltCard3D
                  baseRotate={-6}
                  baseTranslateX={-10}
                  className="w-56 sm:w-64 h-[340px] sm:h-[390px] rounded-2xl p-5 playing-card-parchment foil-glitter hidden md:flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-sheepman text-2xl font-black text-red-700">A</span>
                    <span className="text-xl font-bold text-red-700">♠</span>
                    <ClubEmblem size={16} />
                  </div>
                  <div className="text-center my-auto">
                    <div className="font-baroque text-2xl text-red-800">Round 1</div>
                    <div className="font-sheepman text-3xl text-zinc-950 uppercase font-black tracking-wider">
                      FOURFOLD
                    </div>
                    <div className="text-xs font-mono text-red-900 mt-2 font-bold">
                      15 Qs Per Domain
                    </div>
                    <div className="text-[11px] text-stone-700 mt-2 font-body leading-relaxed">
                      Only the assigned specialist can answer during their active realm phase.
                    </div>
                  </div>
                  <div className="flex items-end justify-between pt-2 border-t border-amber-900/20 text-xs font-mono text-stone-600">
                    <span>26TH-27TH</span>
                    <span className="font-bold text-red-800">15 × 4</span>
                  </div>
                </TiltCard3D>

                {/* Center: 4 Fanned Cards Deck (Sketch 1 Center Bottom) */}
                <div className="relative flex-1 flex flex-col items-center justify-center">
                  <div className="relative w-64 h-72 flex items-center justify-center">
                    {/* Fanned Card 1 (WebDev ♠) */}
                    <motion.div
                      whileHover={{ scale: 1.15, zIndex: 40 }}
                      className="absolute w-44 h-64 rounded-xl p-4 playing-card-parchment foil-glitter shadow-xl flex flex-col justify-between select-none"
                      style={{
                        rotate: "-18deg",
                        x: -50,
                        transformOrigin: "bottom center",
                      }}
                    >
                      <div className="flex justify-between items-center text-xs font-mono text-zinc-900">
                        <span className="font-bold">♠ WEB</span>
                        <ClubEmblem size={14} />
                      </div>
                      <div className="text-center my-auto">
                        <span className="text-3xl">🌐</span>
                        <div className="font-sheepman text-lg text-zinc-950 mt-1 uppercase font-bold">
                          WebDev
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-stone-600">DOMAIN 1</span>
                    </motion.div>

                    {/* Fanned Card 2 (Cyber ♣) */}
                    <motion.div
                      whileHover={{ scale: 1.15, zIndex: 40 }}
                      className="absolute w-44 h-64 rounded-xl p-4 playing-card-parchment foil-glitter shadow-xl flex flex-col justify-between select-none"
                      style={{
                        rotate: "-6deg",
                        x: -15,
                        transformOrigin: "bottom center",
                      }}
                    >
                      <div className="flex justify-between items-center text-xs font-mono text-zinc-900">
                        <span className="font-bold">♣ CYBER</span>
                        <ClubEmblem size={14} />
                      </div>
                      <div className="text-center my-auto">
                        <span className="text-3xl">🛡️</span>
                        <div className="font-sheepman text-lg text-zinc-950 mt-1 uppercase font-bold">
                          CyberOps
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-stone-600">DOMAIN 2</span>
                    </motion.div>

                    {/* Fanned Card 3 (Cloud ♦) */}
                    <motion.div
                      whileHover={{ scale: 1.15, zIndex: 40 }}
                      className="absolute w-44 h-64 rounded-xl p-4 playing-card-parchment foil-glitter shadow-xl flex flex-col justify-between select-none"
                      style={{
                        rotate: "6deg",
                        x: 20,
                        transformOrigin: "bottom center",
                      }}
                    >
                      <div className="flex justify-between items-center text-xs font-mono text-red-700">
                        <span className="font-bold">♦ CLOUD</span>
                        <ClubEmblem size={14} />
                      </div>
                      <div className="text-center my-auto">
                        <span className="text-3xl">☁️</span>
                        <div className="font-sheepman text-lg text-red-950 mt-1 uppercase font-bold">
                          Cloud
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-stone-600">DOMAIN 3</span>
                    </motion.div>

                    {/* Fanned Card 4 (Networking ♥) */}
                    <motion.div
                      whileHover={{ scale: 1.15, zIndex: 40 }}
                      className="absolute w-44 h-64 rounded-xl p-4 playing-card-parchment foil-glitter shadow-xl flex flex-col justify-between select-none"
                      style={{
                        rotate: "18deg",
                        x: 55,
                        transformOrigin: "bottom center",
                      }}
                    >
                      <div className="flex justify-between items-center text-xs font-mono text-red-700">
                        <span className="font-bold">♥ NET</span>
                        <ClubEmblem size={14} />
                      </div>
                      <div className="text-center my-auto">
                        <span className="text-3xl">🔗</span>
                        <div className="font-sheepman text-lg text-red-950 mt-1 uppercase font-bold">
                          Network
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-stone-600">DOMAIN 4</span>
                    </motion.div>
                  </div>

                  {/* CTA Prompt */}
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => goToSlide(1)}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white font-sheepman tracking-widest text-xs uppercase shadow-laser hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
                    >
                      <span>SCROLL OR CLICK TO ENTER REGISTRATION</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-[10px] text-zinc-500 font-mono mt-1.5 animate-pulse">
                      ↓ SCROLL DOWN TO DEAL CARDS
                    </div>
                  </div>
                </div>

                {/* Right Tall Card: ROUND 2 GAMBiT */}
                <TiltCard3D
                  baseRotate={6}
                  baseTranslateX={10}
                  className="w-56 sm:w-64 h-[340px] sm:h-[390px] rounded-2xl p-5 playing-card-parchment foil-glitter hidden md:flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-sheepman text-2xl font-black text-red-700">K</span>
                    <span className="text-xl font-bold text-red-700">♥</span>
                    <ClubEmblem size={16} />
                  </div>
                  <div className="text-center my-auto">
                    <div className="font-baroque text-2xl text-red-800">Round 2</div>
                    <div className="font-sheepman text-3xl text-zinc-950 uppercase font-black tracking-wider">
                      GAMBiT
                    </div>
                    <div className="text-xs font-mono text-red-900 mt-2 font-bold">
                      The Strategy Arena
                    </div>
                    <div className="text-[11px] text-stone-700 mt-2 font-body leading-relaxed">
                      Top clubs face off in live high-concurrency tournament playoffs.
                    </div>
                  </div>
                  <div className="flex items-end justify-between pt-2 border-t border-amber-900/20 text-xs font-mono text-stone-600">
                    <span>SEMINAR HALL 1</span>
                    <span className="font-bold text-red-800">FINALS</span>
                  </div>
                </TiltCard3D>
              </div>
            </motion.div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* SLIDE 1: HAND-HELD IDENTITY CARDS (EXACTLY MATCHING SKETCH 2)      */}
          {/* ----------------------------------------------------------------- */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, scale: 0.7, z: -500 }}
              animate={{ opacity: 1, scale: 1, z: 0 }}
              exit={{
                opacity: 0,
                scale: 1.25,
                z: 400,
                filter: "blur(14px) contrast(180%)",
                transition: { duration: 0.6 },
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex flex-col justify-between py-2 sm:py-4"
            >
              {/* Scattered Cards from Slide 0 Flying to the Left and Right Perimeter (As drawn in Sketch 2!) */}
              <div className="absolute top-10 left-0 w-32 h-44 rounded-xl playing-card-parchment opacity-30 -rotate-45 pointer-events-none hidden lg:block -translate-x-12" />
              <div className="absolute bottom-10 left-4 w-32 h-44 rounded-xl playing-card-parchment opacity-25 rotate-12 pointer-events-none hidden lg:block -translate-x-8" />
              <div className="absolute top-12 right-0 w-32 h-44 rounded-xl playing-card-parchment opacity-30 rotate-45 pointer-events-none hidden lg:block translate-x-12" />
              <div className="absolute bottom-8 right-6 w-32 h-44 rounded-xl playing-card-parchment opacity-25 -rotate-12 pointer-events-none hidden lg:block translate-x-8" />

              {/* Top Banner (As in Sketch 2: "coderlands! important details and all") */}
              <div className="w-full max-w-xl mx-auto rounded-xl p-3 bg-black/70 border border-red-900/50 backdrop-blur-md text-center shadow-lg">
                <div className="font-baroque text-2xl text-red-500">CoderLands Registration</div>
                <p className="text-zinc-400 text-xs font-mono">
                  Stage 1: Hold identity cards in hand • Hover or click to bring to front enlarged
                </p>
              </div>

              {/* Center: The Two Hand-Held Overlapping Cards (Sketch 2 Center) */}
              <div className="relative flex-1 flex items-center justify-center my-2">
                <div className="relative w-full max-w-2xl h-[420px] sm:h-[450px] flex items-center justify-center">
                  {/* Left Hand Card: CLUB NAME */}
                  <TiltCard3D
                    isFocused={focusedCard1 === "club"}
                    baseRotate={-8}
                    baseScale={0.95}
                    baseTranslateX={focusedCard1 === "club" ? 0 : -85}
                    zIndex={focusedCard1 === "club" ? 50 : 20}
                    onClick={() => {
                      sounds.playCardClick();
                      setFocusedCard1("club");
                    }}
                    onMouseEnter={() => {
                      sounds.playCardClick();
                      setFocusedCard1("club");
                    }}
                    className={`absolute w-[290px] sm:w-[340px] h-[390px] sm:h-[430px] rounded-2xl p-5 sm:p-6 playing-card-parchment foil-glitter flex flex-col justify-between ${
                      focusedCard1 === "club" ? "ring-2 ring-red-600 shadow-laser" : "opacity-75"
                    }`}
                  >
                    {/* Top Corner Index */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col items-center leading-none">
                        <span className="font-sheepman text-2xl font-black text-red-700">K</span>
                        <span className="text-xl font-bold text-red-700">♥</span>
                        <div className="mt-1">
                          <ClubEmblem size={16} />
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-red-800 uppercase font-bold px-2 py-0.5 rounded-full bg-red-950/15 border border-red-800/30">
                        {clubName ? "SELECTED" : "CLICK TO FOCUS"}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="my-auto text-center">
                      <div className="font-baroque text-2xl text-red-800">Affiliation</div>
                      <h3 className="font-sheepman text-2xl sm:text-3xl text-zinc-950 font-black uppercase tracking-wider mb-2">
                        CLUB NAME
                      </h3>

                      {focusedCard1 === "club" ? (
                        <div className="space-y-2 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            placeholder="e.g. Technovation"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-stone-100/90 border border-stone-400 focus:border-red-600 text-stone-900 font-medium text-xs sm:text-sm outline-none"
                          />
                          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pt-1">
                            {POPULAR_CLUBS.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  sounds.playCardClick();
                                  setClubName(c);
                                }}
                                className={`text-[10px] px-2 py-0.5 rounded font-medium transition-all ${
                                  clubName === c
                                    ? "bg-red-700 text-white font-bold"
                                    : "bg-stone-200 hover:bg-stone-300 text-stone-800"
                                }`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="py-4">
                          <div className="font-sheepman text-lg text-red-900 uppercase">
                            {clubName || "— CLICK TO ENTER —"}
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono mt-2">
                            (Hover or click to bring to front)
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Inverted Index */}
                    <div className="flex items-end justify-between pt-2 border-t border-amber-900/20 text-[10px] font-mono text-stone-600">
                      <span>CARD 1 // CLUB</span>
                      <div className="flex flex-col items-center leading-none rotate-180">
                        <span className="font-sheepman text-2xl font-black text-red-700">K</span>
                        <span className="text-xl font-bold text-red-700">♥</span>
                      </div>
                    </div>
                  </TiltCard3D>

                  {/* Right Hand Card: TEAM NAME */}
                  <TiltCard3D
                    isFocused={focusedCard1 === "team"}
                    baseRotate={8}
                    baseScale={0.95}
                    baseTranslateX={focusedCard1 === "team" ? 0 : 85}
                    zIndex={focusedCard1 === "team" ? 50 : 20}
                    onClick={() => {
                      sounds.playCardClick();
                      setFocusedCard1("team");
                    }}
                    onMouseEnter={() => {
                      sounds.playCardClick();
                      setFocusedCard1("team");
                    }}
                    className={`absolute w-[290px] sm:w-[340px] h-[390px] sm:h-[430px] rounded-2xl p-5 sm:p-6 playing-card-parchment foil-glitter flex flex-col justify-between ${
                      focusedCard1 === "team" ? "ring-2 ring-red-600 shadow-laser" : "opacity-75"
                    }`}
                  >
                    {/* Top Corner Index */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col items-center leading-none">
                        <span className="font-sheepman text-2xl font-black text-zinc-900">A</span>
                        <span className="text-xl font-bold text-zinc-900">♠</span>
                        <div className="mt-1">
                          <ClubEmblem size={16} />
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-800 uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-950/15 border border-zinc-800/30">
                        {teamName ? "READY" : "CLICK TO FOCUS"}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="my-auto text-center">
                      <div className="font-baroque text-2xl text-red-800">Squad Unit</div>
                      <h3 className="font-sheepman text-2xl sm:text-3xl text-zinc-950 font-black uppercase tracking-wider mb-2">
                        TEAM NAME
                      </h3>

                      {focusedCard1 === "team" ? (
                        <div className="space-y-3 text-left" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            placeholder="e.g. Royal Flush, Binary Knights"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-stone-100/90 border border-stone-400 focus:border-red-600 text-stone-900 font-medium text-xs sm:text-sm outline-none"
                          />
                          <p className="text-[10px] text-stone-600 font-body bg-amber-900/10 p-2 rounded">
                            Unique squad moniker recorded across the arena registry.
                          </p>
                        </div>
                      ) : (
                        <div className="py-4">
                          <div className="font-sheepman text-lg text-red-900 uppercase">
                            {teamName || "— CLICK TO ENTER —"}
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono mt-2">
                            (Hover or click to bring to front)
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Inverted Index */}
                    <div className="flex items-end justify-between pt-2 border-t border-amber-900/20 text-[10px] font-mono text-stone-600">
                      <span>CARD 2 // TEAM</span>
                      <div className="flex flex-col items-center leading-none rotate-180">
                        <span className="font-sheepman text-2xl font-black text-zinc-900">A</span>
                        <span className="text-xl font-bold text-zinc-900">♠</span>
                      </div>
                    </div>
                  </TiltCard3D>
                </div>
              </div>

              {/* Bottom Nav Controls */}
              <div className="flex items-center justify-center gap-4 py-2">
                <button
                  onClick={() => goToSlide(0)}
                  className="px-4 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-zinc-400 font-mono hover:text-white"
                >
                  ← ARENA
                </button>
                <button
                  onClick={() => goToSlide(2)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 text-white font-sheepman tracking-widest text-xs uppercase shadow-laser hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>DEAL PLAYER CARDS (1 & 2)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* SLIDE 2: SQUAD PAIR I (WEBDEV ♠ & CYBERSECURITY ♣)                 */}
          {/* ----------------------------------------------------------------- */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, scale: 0.7, z: -500 }}
              animate={{ opacity: 1, scale: 1, z: 0 }}
              exit={{
                opacity: 0,
                scale: 1.25,
                z: 400,
                filter: "blur(14px) contrast(180%)",
                transition: { duration: 0.6 },
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex flex-col justify-between py-2 sm:py-4"
            >
              {/* Top Banner */}
              <div className="w-full max-w-xl mx-auto rounded-xl p-3 bg-black/70 border border-red-900/50 backdrop-blur-md text-center shadow-lg">
                <div className="font-baroque text-2xl text-red-500">Squad Pair Alpha</div>
                <p className="text-zinc-400 text-xs font-mono">
                  Player #1 (WebDev ♠) & Player #2 (Cybersecurity ♣) • Hover/tap to enlarge
                </p>
              </div>

              {/* Center: Two Overlapping Specialist Cards */}
              <div className="relative flex-1 flex items-center justify-center my-2">
                <div className="relative w-full max-w-2xl h-[420px] sm:h-[450px] flex items-center justify-center">
                  {/* Left Card: PLAYER 1 (WebDev ♠) */}
                  <TiltCard3D
                    isFocused={focusedMemberSlide2 === 0}
                    baseRotate={-8}
                    baseScale={0.95}
                    baseTranslateX={focusedMemberSlide2 === 0 ? 0 : -85}
                    zIndex={focusedMemberSlide2 === 0 ? 50 : 20}
                    onClick={() => {
                      sounds.playCardClick();
                      setFocusedMemberSlide2(0);
                    }}
                    onMouseEnter={() => {
                      sounds.playCardClick();
                      setFocusedMemberSlide2(0);
                    }}
                    className={`absolute w-[290px] sm:w-[340px] h-[390px] sm:h-[430px] rounded-2xl p-5 sm:p-6 playing-card-parchment foil-glitter flex flex-col justify-between ${
                      focusedMemberSlide2 === 0 ? "ring-2 ring-red-600 shadow-laser" : "opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col items-center leading-none">
                        <span className="font-sheepman text-2xl font-black text-red-700">#1</span>
                        <span className="text-xl font-bold text-zinc-900">♠</span>
                        <div className="mt-1">
                          <ClubEmblem size={16} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateMember(0, "isLeader", true);
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                          members[0].isLeader
                            ? "bg-amber-500 text-stone-950 shadow"
                            : "bg-stone-300 hover:bg-stone-400 text-stone-700"
                        }`}
                      >
                        <Crown className="w-3 h-3" />
                        <span>{members[0].isLeader ? "TEAM LEAD" : "MAKE LEAD"}</span>
                      </button>
                    </div>

                    <div className="my-auto text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="font-baroque text-xl text-red-800">Domain Specialist</div>
                      <h4 className="font-sheepman text-xl sm:text-2xl text-zinc-950 font-black uppercase mb-2">
                        🌐 WEB DEVELOPMENT
                      </h4>

                      {focusedMemberSlide2 === 0 ? (
                        <div className="space-y-2 text-left">
                          <div>
                            <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                              Player Name: *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Arisu Ryohei"
                              value={members[0].name}
                              onChange={(e) => updateMember(0, "name", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-900 text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                              Email / Student ID:
                            </label>
                            <input
                              type="email"
                              placeholder="arisu@college.edu"
                              value={members[0].email}
                              onChange={(e) => updateMember(0, "email", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-900 text-xs outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="py-2">
                          <div className="font-sheepman text-base text-red-900 uppercase">
                            {members[0].name || "— CLICK TO FILL —"}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-end justify-between pt-2 border-t border-amber-900/20 text-[10px] font-mono text-stone-600">
                      <span>{members[0].isLeader ? "👑 LEADER" : "MEMBER"}</span>
                      <span className="font-bold text-red-700">15 Qs READY</span>
                    </div>
                  </TiltCard3D>

                  {/* Right Card: PLAYER 2 (Cybersecurity ♣) */}
                  <TiltCard3D
                    isFocused={focusedMemberSlide2 === 1}
                    baseRotate={8}
                    baseScale={0.95}
                    baseTranslateX={focusedMemberSlide2 === 1 ? 0 : 85}
                    zIndex={focusedMemberSlide2 === 1 ? 50 : 20}
                    onClick={() => {
                      sounds.playCardClick();
                      setFocusedMemberSlide2(1);
                    }}
                    onMouseEnter={() => {
                      sounds.playCardClick();
                      setFocusedMemberSlide2(1);
                    }}
                    className={`absolute w-[290px] sm:w-[340px] h-[390px] sm:h-[430px] rounded-2xl p-5 sm:p-6 playing-card-parchment foil-glitter flex flex-col justify-between ${
                      focusedMemberSlide2 === 1 ? "ring-2 ring-red-600 shadow-laser" : "opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col items-center leading-none">
                        <span className="font-sheepman text-2xl font-black text-red-700">#2</span>
                        <span className="text-xl font-bold text-zinc-900">♣</span>
                        <div className="mt-1">
                          <ClubEmblem size={16} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateMember(1, "isLeader", true);
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                          members[1].isLeader
                            ? "bg-amber-500 text-stone-950 shadow"
                            : "bg-stone-300 hover:bg-stone-400 text-stone-700"
                        }`}
                      >
                        <Crown className="w-3 h-3" />
                        <span>{members[1].isLeader ? "TEAM LEAD" : "MAKE LEAD"}</span>
                      </button>
                    </div>

                    <div className="my-auto text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="font-baroque text-xl text-red-800">Domain Specialist</div>
                      <h4 className="font-sheepman text-xl sm:text-2xl text-zinc-950 font-black uppercase mb-2">
                        🛡️ CYBERSECURITY
                      </h4>

                      {focusedMemberSlide2 === 1 ? (
                        <div className="space-y-2 text-left">
                          <div>
                            <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                              Player Name: *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Yuzuha Usagi"
                              value={members[1].name}
                              onChange={(e) => updateMember(1, "name", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-900 text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                              Email / Student ID:
                            </label>
                            <input
                              type="email"
                              placeholder="usagi@college.edu"
                              value={members[1].email}
                              onChange={(e) => updateMember(1, "email", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-900 text-xs outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="py-2">
                          <div className="font-sheepman text-base text-red-900 uppercase">
                            {members[1].name || "— CLICK TO FILL —"}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-end justify-between pt-2 border-t border-amber-900/20 text-[10px] font-mono text-stone-600">
                      <span>{members[1].isLeader ? "👑 LEADER" : "MEMBER"}</span>
                      <span className="font-bold text-red-700">15 Qs READY</span>
                    </div>
                  </TiltCard3D>
                </div>
              </div>

              {/* Bottom Nav Controls */}
              <div className="flex items-center justify-center gap-4 py-2">
                <button
                  onClick={() => goToSlide(1)}
                  className="px-4 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-zinc-400 font-mono hover:text-white"
                >
                  ← IDENTITY
                </button>
                <button
                  onClick={() => goToSlide(3)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 text-white font-sheepman tracking-widest text-xs uppercase shadow-laser hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>DEAL PLAYER CARDS (3 & 4)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* SLIDE 3: SQUAD PAIR II (CLOUD ♦ & NETWORKING ♥)                    */}
          {/* ----------------------------------------------------------------- */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, scale: 0.7, z: -500 }}
              animate={{ opacity: 1, scale: 1, z: 0 }}
              exit={{
                opacity: 0,
                scale: 1.25,
                z: 400,
                filter: "blur(14px) contrast(180%)",
                transition: { duration: 0.6 },
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex flex-col justify-between py-2 sm:py-4"
            >
              {/* Top Banner */}
              <div className="w-full max-w-xl mx-auto rounded-xl p-3 bg-black/70 border border-red-900/50 backdrop-blur-md text-center shadow-lg">
                <div className="font-baroque text-2xl text-red-500">Squad Pair Bravo</div>
                <p className="text-zinc-400 text-xs font-mono">
                  Player #3 (Cloud ♦) & Player #4 (Networking ♥) • Hover/tap to enlarge
                </p>
              </div>

              {/* Center: Two Overlapping Specialist Cards */}
              <div className="relative flex-1 flex items-center justify-center my-2">
                <div className="relative w-full max-w-2xl h-[420px] sm:h-[450px] flex items-center justify-center">
                  {/* Left Card: PLAYER 3 (Cloud ♦) */}
                  <TiltCard3D
                    isFocused={focusedMemberSlide3 === 2}
                    baseRotate={-8}
                    baseScale={0.95}
                    baseTranslateX={focusedMemberSlide3 === 2 ? 0 : -85}
                    zIndex={focusedMemberSlide3 === 2 ? 50 : 20}
                    onClick={() => {
                      sounds.playCardClick();
                      setFocusedMemberSlide3(2);
                    }}
                    onMouseEnter={() => {
                      sounds.playCardClick();
                      setFocusedMemberSlide3(2);
                    }}
                    className={`absolute w-[290px] sm:w-[340px] h-[390px] sm:h-[430px] rounded-2xl p-5 sm:p-6 playing-card-parchment foil-glitter flex flex-col justify-between ${
                      focusedMemberSlide3 === 2 ? "ring-2 ring-red-600 shadow-laser" : "opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col items-center leading-none">
                        <span className="font-sheepman text-2xl font-black text-red-700">#3</span>
                        <span className="text-xl font-bold text-red-700">♦</span>
                        <div className="mt-1">
                          <ClubEmblem size={16} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateMember(2, "isLeader", true);
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                          members[2].isLeader
                            ? "bg-amber-500 text-stone-950 shadow"
                            : "bg-stone-300 hover:bg-stone-400 text-stone-700"
                        }`}
                      >
                        <Crown className="w-3 h-3" />
                        <span>{members[2].isLeader ? "TEAM LEAD" : "MAKE LEAD"}</span>
                      </button>
                    </div>

                    <div className="my-auto text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="font-baroque text-xl text-red-800">Domain Specialist</div>
                      <h4 className="font-sheepman text-xl sm:text-2xl text-zinc-950 font-black uppercase mb-2">
                        ☁️ CLOUD COMPUTING
                      </h4>

                      {focusedMemberSlide3 === 2 ? (
                        <div className="space-y-2 text-left">
                          <div>
                            <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                              Player Name: *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Shuntaro Chishiya"
                              value={members[2].name}
                              onChange={(e) => updateMember(2, "name", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-900 text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                              Email / Student ID:
                            </label>
                            <input
                              type="email"
                              placeholder="chishiya@college.edu"
                              value={members[2].email}
                              onChange={(e) => updateMember(2, "email", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-900 text-xs outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="py-2">
                          <div className="font-sheepman text-base text-red-900 uppercase">
                            {members[2].name || "— CLICK TO FILL —"}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-end justify-between pt-2 border-t border-amber-900/20 text-[10px] font-mono text-stone-600">
                      <span>{members[2].isLeader ? "👑 LEADER" : "MEMBER"}</span>
                      <span className="font-bold text-red-700">15 Qs READY</span>
                    </div>
                  </TiltCard3D>

                  {/* Right Card: PLAYER 4 (Networking ♥) */}
                  <TiltCard3D
                    isFocused={focusedMemberSlide3 === 3}
                    baseRotate={8}
                    baseScale={0.95}
                    baseTranslateX={focusedMemberSlide3 === 3 ? 0 : 85}
                    zIndex={focusedMemberSlide3 === 3 ? 50 : 20}
                    onClick={() => {
                      sounds.playCardClick();
                      setFocusedMemberSlide3(3);
                    }}
                    onMouseEnter={() => {
                      sounds.playCardClick();
                      setFocusedMemberSlide3(3);
                    }}
                    className={`absolute w-[290px] sm:w-[340px] h-[390px] sm:h-[430px] rounded-2xl p-5 sm:p-6 playing-card-parchment foil-glitter flex flex-col justify-between ${
                      focusedMemberSlide3 === 3 ? "ring-2 ring-red-600 shadow-laser" : "opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col items-center leading-none">
                        <span className="font-sheepman text-2xl font-black text-red-700">#4</span>
                        <span className="text-xl font-bold text-red-700">♥</span>
                        <div className="mt-1">
                          <ClubEmblem size={16} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateMember(3, "isLeader", true);
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                          members[3].isLeader
                            ? "bg-amber-500 text-stone-950 shadow"
                            : "bg-stone-300 hover:bg-stone-400 text-stone-700"
                        }`}
                      >
                        <Crown className="w-3 h-3" />
                        <span>{members[3].isLeader ? "TEAM LEAD" : "MAKE LEAD"}</span>
                      </button>
                    </div>

                    <div className="my-auto text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="font-baroque text-xl text-red-800">Domain Specialist</div>
                      <h4 className="font-sheepman text-xl sm:text-2xl text-zinc-950 font-black uppercase mb-2">
                        🔗 NETWORKING
                      </h4>

                      {focusedMemberSlide3 === 3 ? (
                        <div className="space-y-2 text-left">
                          <div>
                            <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                              Player Name: *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Hikari Kuina"
                              value={members[3].name}
                              onChange={(e) => updateMember(3, "name", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-900 text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                              Email / Student ID:
                            </label>
                            <input
                              type="email"
                              placeholder="kuina@college.edu"
                              value={members[3].email}
                              onChange={(e) => updateMember(3, "email", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-900 text-xs outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="py-2">
                          <div className="font-sheepman text-base text-red-900 uppercase">
                            {members[3].name || "— CLICK TO FILL —"}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-end justify-between pt-2 border-t border-amber-900/20 text-[10px] font-mono text-stone-600">
                      <span>{members[3].isLeader ? "👑 LEADER" : "MEMBER"}</span>
                      <span className="font-bold text-red-700">15 Qs READY</span>
                    </div>
                  </TiltCard3D>
                </div>
              </div>

              {/* Bottom Nav Controls */}
              <div className="flex items-center justify-center gap-4 py-2">
                <button
                  onClick={() => goToSlide(2)}
                  className="px-4 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-zinc-400 font-mono hover:text-white"
                >
                  ← PLAYERS (1 & 2)
                </button>
                <button
                  onClick={() => goToSlide(4)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 text-white font-sheepman tracking-widest text-xs uppercase shadow-laser hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>SEAL VISA CONTRACT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* SLIDE 4: THE GRAND VISA CONTRACT & CLEARANCE PASSPORT             */}
          {/* ----------------------------------------------------------------- */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0, scale: 0.7, z: -500 }}
              animate={{ opacity: 1, scale: 1, z: 0 }}
              exit={{
                opacity: 0,
                scale: 1.25,
                z: 400,
                filter: "blur(14px) contrast(180%)",
                transition: { duration: 0.6 },
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex flex-col justify-between py-2 sm:py-4 max-w-2xl mx-auto"
            >
              {!registeredTeam ? (
                /* Stage A: Pre-Submit Dossier Contract */
                <div className="w-full rounded-2xl p-5 sm:p-6 playing-card-dark foil-glitter shadow-2xl relative my-auto">
                  <div className="flex items-center justify-between border-b border-red-900/40 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <ClubEmblem size={24} />
                    </div>
                    <div className="font-baroque text-lg sm:text-xl text-zinc-100 font-bold tracking-wide text-center">
                      Coderland Visa Application
                    </div>
                    <span className="font-mono text-xs text-red-400 font-bold">26–27 NOV · CL-2026</span>
                  </div>

                  {/* Identity Summary */}
                  <div className="grid grid-cols-2 gap-3 mb-3 text-left">
                    <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
                      <div className="text-[10px] font-mono text-red-400 uppercase font-bold">
                        Club Affiliation:
                      </div>
                      <div className="font-sheepman text-base text-zinc-100 truncate">
                        {clubName || "NOT ENTERED"}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
                      <div className="text-[10px] font-mono text-red-400 uppercase font-bold">
                        Squad Moniker:
                      </div>
                      <div className="font-sheepman text-base text-zinc-100 truncate">
                        {teamName || "NOT ENTERED"}
                      </div>
                    </div>
                  </div>

                  {/* 4 Members Allocation */}
                  <div className="mb-4 text-left">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      Assigned Specialists:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {members.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-black/40 border border-red-900/30 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-[10px] text-red-400 font-mono block">
                              {m.domain}:
                            </span>
                            <span className="text-zinc-200 font-medium truncate block max-w-[120px]">
                              {m.name || "UNNAMED"}
                            </span>
                          </div>
                          {m.isLeader && (
                            <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                              LEAD
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Action Button */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => goToSlide(3)}
                      className="px-4 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-zinc-400 font-mono hover:text-white"
                    >
                      ← EDIT SQUAD
                    </button>
                    <button
                      disabled={isSubmitting}
                      onClick={handleSubmitRegistration}
                      className="px-7 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-sheepman tracking-[0.2em] text-sm uppercase shadow-laser hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer"
                    >
                      {isSubmitting ? "Locking Registration..." : "Lock Registration"}
                    </button>
                  </div>
                </div>
              ) : (
                /* Stage B: Alice in Borderland VISA GRANTED Screen */
                <div className="w-full rounded-2xl p-5 sm:p-7 playing-card-parchment foil-glitter shadow-2xl relative my-auto text-stone-900 animate-fadeIn">
                  <div className="flex items-start justify-between border-b border-amber-900/30 pb-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <ClubEmblem size={28} />
                      <div>
                        <div className="font-techno text-[10px] text-red-800 font-bold uppercase tracking-widest">
                          CODERLAND VISA • CONFIRMED
                        </div>
                        <div className="font-baroque text-2xl text-stone-900">
                          CoderLands Player Pass
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-sheepman text-xl text-red-800 font-black">
                        {registeredTeam.id}
                      </div>
                      <div className="text-[9px] font-mono text-stone-600">TEAM REG ID</div>
                    </div>
                  </div>

                  <div className="text-center my-2">
                    <div className="font-sheepman text-2xl sm:text-3xl text-zinc-950 uppercase font-black">
                      {registeredTeam.teamName}
                    </div>
                    <div className="text-xs font-mono text-red-900 font-bold">
                      Club: {registeredTeam.clubName}
                    </div>
                  </div>

                  {/* Secret Passcode for Main Quiz Site */}
                  <div className="p-3 my-3 rounded-xl bg-zinc-950 text-zinc-100 border-2 border-red-600 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] font-mono text-red-400 uppercase tracking-widest font-bold">
                        MAIN SITE QUIZ ACCESS CODE:
                      </div>
                      <div className="font-mono text-xl font-black text-white tracking-widest">
                        {registeredTeam.passcode}
                      </div>
                    </div>
                    <button
                      onClick={copyCredentials}
                      className="p-2 rounded bg-red-700 hover:bg-red-600 text-white transition-all"
                      title="Copy credentials"
                    >
                      {copiedCode ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Specialists list */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-body text-left mb-3">
                    <div className="p-1.5 rounded bg-amber-900/10">
                      <span className="font-bold text-red-900 block font-mono">🌐 WebDev:</span>
                      <span className="truncate block">{registeredTeam.domainMap.webDev}</span>
                    </div>
                    <div className="p-1.5 rounded bg-amber-900/10">
                      <span className="font-bold text-red-900 block font-mono">🛡️ Cyber:</span>
                      <span className="truncate block">{registeredTeam.domainMap.cybersecurity}</span>
                    </div>
                    <div className="p-1.5 rounded bg-amber-900/10">
                      <span className="font-bold text-red-900 block font-mono">☁️ Cloud:</span>
                      <span className="truncate block">{registeredTeam.domainMap.cloud}</span>
                    </div>
                    <div className="p-1.5 rounded bg-amber-900/10">
                      <span className="font-bold text-red-900 block font-mono">🔗 Network:</span>
                      <span className="truncate block">{registeredTeam.domainMap.networking}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-amber-900/20">
                    <button
                      onClick={copyCredentials}
                      className="px-4 py-1.5 rounded-lg bg-black/80 text-white font-mono text-[11px] flex items-center gap-1.5"
                    >
                      {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "COPIED" : "COPY PASS"}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-1.5 rounded-lg bg-red-700 text-white font-mono text-[11px] flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PRINT CARD</span>
                    </button>
                    <button
                      onClick={() => {
                        setRegisteredTeam(null);
                        setClubName("");
                        setTeamName("");
                        goToSlide(0);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-stone-200 text-stone-800 font-mono text-[11px]"
                    >
                      REGISTER ANOTHER
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ===================================================================== */}
      {/* BOTTOM DOCK: MOTION SLIDE CONTROLS & SCROLL HINT                      */}
      {/* ===================================================================== */}
      <footer className="relative z-50 flex items-center justify-between w-full max-w-6xl mx-auto border-t border-red-900/30 pt-3 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span className="text-zinc-400">STAGE {currentSlide + 1} OF 5</span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === i ? "w-8 bg-red-600 shadow-[0_0_8px_#ff113a]" : "w-2 bg-zinc-800 hover:bg-zinc-600"
              }`}
            />
          ))}
        </div>

        <div className="text-right text-[11px] text-zinc-500">
          <span>SCROLL OR USE ARROWS</span>
        </div>
      </footer>
    </div>
  );
}
