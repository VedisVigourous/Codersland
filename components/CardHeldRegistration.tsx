"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClubEmblem from "./ClubEmblem";
import { sounds } from "@/lib/sounds";
import confetti from "canvas-confetti";
import { 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Download, 
  Copy, 
  ExternalLink,
  Layers,
  UserCheck
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

export default function CardHeldRegistration() {
  // Wizard Steps: 1 = Hand of 2 (Club & Team), 2 = Hand of 4 (Members & Domains), 3 = Review Dossier, 4 = Visa Granted
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 Active Focused Card: 'club' or 'team'
  const [activeCardHand1, setActiveCardHand1] = useState<"club" | "team">("club");

  // Step 2 Active Member Card index: 0, 1, 2, 3
  const [activeMemberIdx, setActiveMemberIdx] = useState<number>(0);

  // Form State
  const [clubName, setClubName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<MemberData[]>([
    { name: "", email: "", phone: "", isLeader: true, domain: "Web Development" },
    { name: "", email: "", phone: "", isLeader: false, domain: "Cybersecurity" },
    { name: "", email: "", phone: "", isLeader: false, domain: "Cloud" },
    { name: "", email: "", phone: "", isLeader: false, domain: "Networking" },
  ]);

  // Submission & Result State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredTeam, setRegisteredTeam] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Update member helper
  const updateMember = (index: number, field: keyof MemberData, value: any) => {
    setMembers((prev) => {
      const updated = [...prev];
      if (field === "isLeader" && value === true) {
        // Only one leader allowed: unset others
        updated.forEach((m, i) => {
          m.isLeader = i === index;
        });
      } else if (field === "domain") {
        // If assigning domain that another member already has, swap their domains!
        const targetDomain = value as DomainType;
        const previousOwnerIdx = updated.findIndex((m, i) => i !== index && m.domain === targetDomain);
        if (previousOwnerIdx !== -1) {
          const oldDomain = updated[index].domain;
          updated[previousOwnerIdx].domain = oldDomain;
        }
        updated[index].domain = targetDomain;
      } else {
        (updated[index] as any)[field] = value;
      }
      return updated;
    });
  };

  // Step 1 validation
  const validateStep1 = () => {
    if (!clubName.trim()) {
      setErrorMessage("Please input or select your Club Name on the left card.");
      setActiveCardHand1("club");
      return false;
    }
    if (!teamName.trim()) {
      setErrorMessage("Please enter your Team Name on the right card.");
      setActiveCardHand1("team");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  // Step 2 validation
  const validateStep2 = () => {
    for (let i = 0; i < 4; i++) {
      if (!members[i].name.trim()) {
        setErrorMessage(`Please enter Member #${i + 1}'s name.`);
        setActiveMemberIdx(i);
        return false;
      }
    }
    const leaders = members.filter((m) => m.isLeader);
    if (leaders.length !== 1) {
      setErrorMessage("Please designate exactly one member as Team Lead.");
      return false;
    }
    // Check all 4 domains covered
    const domains = members.map((m) => m.domain);
    const required: DomainType[] = ["Web Development", "Cybersecurity", "Cloud", "Networking"];
    for (const r of required) {
      if (!domains.includes(r)) {
        setErrorMessage(`Each of the 4 domains must be assigned to one member. Missing: ${r}`);
        return false;
      }
    }
    setErrorMessage(null);
    return true;
  };

  // Next step handler
  const handleProceedToMembers = () => {
    if (validateStep1()) {
      sounds.playCardSwoosh();
      setCurrentStep(2);
    }
  };

  const handleProceedToDossier = () => {
    if (validateStep2()) {
      sounds.playCardSwoosh();
      setCurrentStep(3);
    }
  };

  // Final Submission to API
  const handleSubmitRegistration = async () => {
    if (!validateStep1() || !validateStep2()) return;
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
      setCurrentStep(4);
      sounds.playVisaGranted();

      // Fire celebratory Borderland confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff113a", "#d6001c", "#f4ede0", "#c5a059"],
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
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
    <section id="registration-deck" className="relative z-20 py-16 px-4 max-w-5xl mx-auto scroll-mt-10">
      {/* Wizard Progress Indicator */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 text-xs font-mono select-none">
        <div
          className={`px-3 py-1.5 rounded-full border flex items-center gap-2 transition-all ${
            currentStep === 1
              ? "bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_12px_#ff113a]"
              : currentStep > 1
              ? "bg-black/60 border-emerald-700/60 text-emerald-400"
              : "bg-black/40 border-zinc-800 text-zinc-500"
          }`}
        >
          <span>CARD HAND 1</span>
          <span className="hidden sm:inline">• Identity</span>
        </div>
        <div className="w-4 h-px bg-zinc-700" />
        <div
          className={`px-3 py-1.5 rounded-full border flex items-center gap-2 transition-all ${
            currentStep === 2
              ? "bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_12px_#ff113a]"
              : currentStep > 2
              ? "bg-black/60 border-emerald-700/60 text-emerald-400"
              : "bg-black/40 border-zinc-800 text-zinc-500"
          }`}
        >
          <span>CARD HAND 2</span>
          <span className="hidden sm:inline">• 4 Domain Specialists</span>
        </div>
        <div className="w-4 h-px bg-zinc-700" />
        <div
          className={`px-3 py-1.5 rounded-full border flex items-center gap-2 transition-all ${
            currentStep === 3
              ? "bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_12px_#ff113a]"
              : currentStep === 4
              ? "bg-black/60 border-emerald-700/60 text-emerald-400"
              : "bg-black/40 border-zinc-800 text-zinc-500"
          }`}
        >
          <span>STAGE 3</span>
          <span className="hidden sm:inline">• Visa Clearance</span>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-600 text-red-200 flex items-center gap-3 backdrop-blur-md animate-shake">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: HAND-HELD CARDS (CLUB NAME & TEAM NAME)                            */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="font-sheepman text-3xl sm:text-4xl uppercase text-zinc-100 tracking-wider">
              HOLD YOUR IDENTITY CARDS
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Two cards held in hand: Click either card to bring it into focus and complete your entry.
            </p>
          </div>

          {/* Hand of 2 Cards fanned together */}
          <div className="relative w-full max-w-2xl h-[490px] sm:h-[460px] flex items-center justify-center my-2">
            {/* Card A: CLUB NAME (Left Card) */}
            <motion.div
              onClick={() => {
                sounds.playCardClick();
                setActiveCardHand1("club");
              }}
              animate={{
                x: activeCardHand1 === "club" ? 0 : -90,
                y: activeCardHand1 === "club" ? -10 : 30,
                rotate: activeCardHand1 === "club" ? 0 : -9,
                scale: activeCardHand1 === "club" ? 1.03 : 0.9,
                zIndex: activeCardHand1 === "club" ? 30 : 10,
                opacity: activeCardHand1 === "club" ? 1 : 0.75,
              }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className={`absolute w-[300px] sm:w-[350px] min-h-[400px] rounded-2xl p-6 playing-card-parchment foil-glitter cursor-pointer shadow-card transition-all ${
                activeCardHand1 === "club" ? "ring-2 ring-red-600" : ""
              }`}
            >
              {/* Card Corner Index */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col items-center leading-none">
                  <span className="font-sheepman text-2xl font-black text-red-700">K</span>
                  <span className="text-xl font-bold text-red-700">♥</span>
                  <div className="mt-1">
                    <ClubEmblem size={16} />
                  </div>
                </div>
                <span className="font-mono text-[10px] tracking-widest text-red-800 uppercase font-bold px-2 py-0.5 rounded-full bg-red-950/15 border border-red-800/30">
                  {clubName ? "COMPLETED" : "CARD 1 OF 2"}
                </span>
              </div>

              {/* Card Body */}
              <div className="my-4 text-center">
                <div className="font-baroque text-2xl text-red-800">Affiliation</div>
                <h3 className="font-sheepman text-2xl sm:text-3xl text-zinc-950 font-black uppercase tracking-wider mb-3">
                  CLUB NAME
                </h3>

                {activeCardHand1 === "club" ? (
                  <div className="space-y-3 text-left">
                    <label className="text-xs font-mono font-bold uppercase text-stone-800">
                      Enter or Select Club:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Technovation"
                      value={clubName}
                      onChange={(e) => setClubName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-stone-100/90 border border-stone-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-stone-900 font-medium text-sm outline-none"
                    />

                    {/* Quick Suggestions */}
                    <div className="pt-1">
                      <span className="text-[10px] font-mono font-semibold text-stone-600 uppercase block mb-1.5">
                        Quick Select:
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                        {POPULAR_CLUBS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              sounds.playCardClick();
                              setClubName(c);
                            }}
                            className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                              clubName === c
                                ? "bg-red-700 text-white font-bold"
                                : "bg-stone-200/90 hover:bg-stone-300 text-stone-800"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="text-stone-700 text-sm font-medium">Selected Club:</div>
                    <div className="font-sheepman text-xl text-red-900 mt-1 uppercase">
                      {clubName || "— NOT ENTERED —"}
                    </div>
                    <div className="text-xs text-stone-500 mt-3 font-mono">
                      (Tap to bring to front)
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Inverted Index */}
              <div className="flex items-end justify-between pt-2 border-t border-amber-900/20">
                <span className="font-mono text-[10px] text-stone-600">CARD I // CLUB</span>
                <div className="flex flex-col items-center leading-none rotate-180">
                  <span className="font-sheepman text-2xl font-black text-red-700">K</span>
                  <span className="text-xl font-bold text-red-700">♥</span>
                </div>
              </div>
            </motion.div>

            {/* Card B: TEAM NAME (Right Card) */}
            <motion.div
              onClick={() => {
                sounds.playCardClick();
                setActiveCardHand1("team");
              }}
              animate={{
                x: activeCardHand1 === "team" ? 0 : 90,
                y: activeCardHand1 === "team" ? -10 : 30,
                rotate: activeCardHand1 === "team" ? 0 : 9,
                scale: activeCardHand1 === "team" ? 1.03 : 0.9,
                zIndex: activeCardHand1 === "team" ? 30 : 10,
                opacity: activeCardHand1 === "team" ? 1 : 0.75,
              }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className={`absolute w-[300px] sm:w-[350px] min-h-[400px] rounded-2xl p-6 playing-card-parchment foil-glitter cursor-pointer shadow-card transition-all ${
                activeCardHand1 === "team" ? "ring-2 ring-red-600" : ""
              }`}
            >
              {/* Card Corner Index */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col items-center leading-none">
                  <span className="font-sheepman text-2xl font-black text-zinc-900">A</span>
                  <span className="text-xl font-bold text-zinc-900">♠</span>
                  <div className="mt-1">
                    <ClubEmblem size={16} />
                  </div>
                </div>
                <span className="font-mono text-[10px] tracking-widest text-zinc-800 uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-950/15 border border-zinc-800/30">
                  {teamName ? "COMPLETED" : "CARD 2 OF 2"}
                </span>
              </div>

              {/* Card Body */}
              <div className="my-4 text-center">
                <div className="font-baroque text-2xl text-red-800">Squad Unit</div>
                <h3 className="font-sheepman text-2xl sm:text-3xl text-zinc-950 font-black uppercase tracking-wider mb-3">
                  TEAM NAME
                </h3>

                {activeCardHand1 === "team" ? (
                  <div className="space-y-4 text-left">
                    <label className="text-xs font-mono font-bold uppercase text-stone-800">
                      Create Your Team Moniker:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Flush, Binary Knights"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-stone-100/90 border border-stone-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-stone-900 font-medium text-sm outline-none"
                    />

                    <p className="text-[11px] text-stone-600 font-body leading-relaxed bg-amber-900/10 p-2.5 rounded-md border border-amber-900/15">
                      ⚠️ Team names are unique across the Borderland database. Choose a fierce and recognizable squad name.
                    </p>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="text-stone-700 text-sm font-medium">Selected Team:</div>
                    <div className="font-sheepman text-xl text-red-900 mt-1 uppercase">
                      {teamName || "— NOT ENTERED —"}
                    </div>
                    <div className="text-xs text-stone-500 mt-3 font-mono">
                      (Tap to bring to front)
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Inverted Index */}
              <div className="flex items-end justify-between pt-2 border-t border-amber-900/20">
                <span className="font-mono text-[10px] text-stone-600">CARD II // TEAM</span>
                <div className="flex flex-col items-center leading-none rotate-180">
                  <span className="font-sheepman text-2xl font-black text-zinc-900">A</span>
                  <span className="text-xl font-bold text-zinc-900">♠</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action button */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => {
                setActiveCardHand1(activeCardHand1 === "club" ? "team" : "club");
                sounds.playCardClick();
              }}
              className="px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-xs text-zinc-300 font-mono hover:border-red-500 transition-all"
            >
              SWAP FOCUSED CARD ⇄
            </button>
            <button
              onClick={handleProceedToMembers}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 text-white font-sheepman tracking-widest text-sm uppercase shadow-laser hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>DEAL PLAYERS DECK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: HAND OF 4 CARDS (4 DOMAIN SPECIALISTS)                            */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="flex flex-col items-center">
          <div className="text-center mb-6">
            <h2 className="font-sheepman text-3xl sm:text-4xl uppercase text-zinc-100 tracking-wider">
              ASSIGN 4 SQUAD SPECIALISTS
            </h2>
            <p className="text-zinc-400 text-sm mt-1 max-w-xl">
              Four playing cards fanned out. Assign 1 team member to each locked domain: WebDev, Cybersecurity, Cloud, and Networking. Select exactly 1 Leader.
            </p>
          </div>

          {/* Mini Card Selector Deck Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-2xl mb-6">
            {members.map((m, idx) => {
              const domOpt = DOMAIN_OPTIONS.find((d) => d.id === m.domain);
              const isSelected = activeMemberIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playCardClick();
                    setActiveMemberIdx(idx);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-red-950/80 border-red-500 shadow-[0_0_12px_#ff113a]"
                      : "bg-black/60 border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-red-400 font-bold">
                      {domOpt?.suit} PLAYER #{idx + 1}
                    </span>
                    {m.isLeader && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div className="font-sheepman text-zinc-100 truncate mt-1 text-sm">
                    {m.name || "UNNAMED"}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    {domOpt?.icon} {m.domain}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Card In-Focus view */}
          <div className="relative w-full max-w-lg min-h-[460px] my-2 flex justify-center">
            <motion.div
              key={activeMemberIdx}
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full rounded-2xl p-6 sm:p-7 playing-card-parchment foil-glitter shadow-card"
            >
              {/* Card Corner Top */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col items-center leading-none">
                  <span className="font-sheepman text-2xl font-black text-red-700">
                    #{activeMemberIdx + 1}
                  </span>
                  <span className="text-xl font-bold text-red-700">
                    {DOMAIN_OPTIONS.find((d) => d.id === members[activeMemberIdx].domain)?.suit}
                  </span>
                  <div className="mt-1">
                    <ClubEmblem size={16} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateMember(activeMemberIdx, "isLeader", true)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      members[activeMemberIdx].isLeader
                        ? "bg-amber-500 text-stone-950 shadow-md"
                        : "bg-stone-300/80 hover:bg-stone-400 text-stone-700"
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>{members[activeMemberIdx].isLeader ? "TEAM LEAD" : "MAKE LEAD"}</span>
                  </button>
                </div>
              </div>

              {/* Form Fields for this card */}
              <div className="my-4">
                <div className="text-center mb-4">
                  <div className="font-baroque text-2xl text-red-800">
                    Specialist Dossier
                  </div>
                  <div className="font-sheepman text-2xl text-zinc-950 uppercase tracking-wide">
                    PLAYER #{activeMemberIdx + 1} REGISTRATION
                  </div>
                </div>

                <div className="space-y-3.5 text-stone-900 font-body">
                  {/* Member Name */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-stone-800 mb-1">
                      Member Full Name: *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Arisu Ryohei"
                      value={members[activeMemberIdx].name}
                      onChange={(e) => updateMember(activeMemberIdx, "name", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-stone-100/95 border border-stone-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-stone-950 font-medium text-sm outline-none"
                    />
                  </div>

                  {/* Member Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-stone-800 mb-1">
                        Email Address:
                      </label>
                      <input
                        type="email"
                        placeholder="player@university.edu"
                        value={members[activeMemberIdx].email}
                        onChange={(e) => updateMember(activeMemberIdx, "email", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-stone-100/95 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-stone-800 mb-1">
                        Phone / WhatsApp:
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={members[activeMemberIdx].phone}
                        onChange={(e) => updateMember(activeMemberIdx, "phone", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-stone-100/95 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Domain Assignment Selector */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-stone-800 mb-1.5">
                      Assigned Event Domain (15 Questions):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {DOMAIN_OPTIONS.map((opt) => {
                        const isChosenByThis = members[activeMemberIdx].domain === opt.id;
                        const takenByOther = members.some(
                          (m, i) => i !== activeMemberIdx && m.domain === opt.id
                        );
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              sounds.playCardClick();
                              updateMember(activeMemberIdx, "domain", opt.id);
                            }}
                            className={`p-2 rounded-lg border text-left text-xs font-medium transition-all ${
                              isChosenByThis
                                ? "bg-red-700 text-white border-red-800 font-bold shadow-sm"
                                : takenByOther
                                ? "bg-stone-200/90 text-stone-700 border-stone-300 hover:bg-stone-300"
                                : "bg-stone-100 text-stone-800 border-stone-300 hover:bg-stone-200"
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{opt.icon}</span>
                              <span className="truncate">{opt.label}</span>
                            </div>
                            {takenByOther && !isChosenByThis && (
                              <span className="text-[9px] block text-stone-500 font-mono mt-0.5">
                                (Will swap automatically)
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Inverted Index */}
              <div className="flex items-end justify-between pt-2 border-t border-amber-900/20">
                <span className="font-mono text-[10px] text-stone-600">
                  {members[activeMemberIdx].isLeader ? "👑 TEAM LEADER" : "MEMBER"} // {members[activeMemberIdx].domain}
                </span>
                <div className="flex flex-col items-center leading-none rotate-180">
                  <span className="font-sheepman text-2xl font-black text-red-700">
                    #{activeMemberIdx + 1}
                  </span>
                  <span className="text-xl font-bold text-red-700">
                    {DOMAIN_OPTIONS.find((d) => d.id === members[activeMemberIdx].domain)?.suit}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stepper controls */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => {
                sounds.playCardClick();
                setCurrentStep(1);
              }}
              className="px-5 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-zinc-300 text-xs font-mono hover:border-red-500 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>EDIT CLUB & TEAM</span>
            </button>

            {activeMemberIdx < 3 ? (
              <button
                onClick={() => {
                  sounds.playCardClick();
                  setActiveMemberIdx((prev) => prev + 1);
                }}
                className="px-6 py-2.5 rounded-xl bg-stone-800 text-zinc-100 border border-zinc-600 text-xs font-mono hover:bg-stone-700 transition-all"
              >
                NEXT PLAYER (#{activeMemberIdx + 2}) →
              </button>
            ) : null}

            <button
              onClick={handleProceedToDossier}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 text-white font-sheepman tracking-widest text-sm uppercase shadow-laser hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>REVIEW FINAL SQUAD DOSSIER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: DOSSIER REVIEW & VISA CONTRACT SUBMISSION                         */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="flex flex-col items-center">
          <div className="text-center mb-6">
            <h2 className="font-sheepman text-3xl sm:text-4xl uppercase text-zinc-100 tracking-wider">
              CONFIRM CODERLANDS VISA CONTRACT
            </h2>
            <p className="text-zinc-400 text-sm mt-1 max-w-lg">
              Review all squad parameters before sealing registration. Once locked, credentials are saved to the persistent arena database.
            </p>
          </div>

          {/* Master Visa Application Dossier Card */}
          <div className="w-full max-w-2xl rounded-2xl p-6 sm:p-8 playing-card-dark foil-glitter shadow-2xl relative overflow-hidden">
            {/* Single Line Header: [N] Coderlands Visa Application (Left) | Date & Reg ID (Right) */}
            <div className="flex items-center justify-between border-b border-red-900/40 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <ClubEmblem size={28} />
                <span className="font-baroque text-2xl text-zinc-100 font-bold tracking-wide">
                  Coderlands Visa Application
                </span>
              </div>
              <div className="text-right font-mono text-xs text-red-400 font-bold tracking-wider">
                26–27 NOV · CL-2026
              </div>
            </div>

            {/* Club & Team Identity Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800">
                <div className="text-xs font-mono text-red-400 uppercase font-semibold">
                  Club Affiliation:
                </div>
                <div className="font-sheepman text-xl text-zinc-100 uppercase mt-0.5">
                  {clubName}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800">
                <div className="text-xs font-mono text-red-400 uppercase font-semibold">
                  Squad Unit Name:
                </div>
                <div className="font-sheepman text-xl text-zinc-100 uppercase mt-0.5">
                  {teamName}
                </div>
              </div>
            </div>

            {/* 4 Member Domains Breakdown */}
            <div className="mb-6">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2.5">
                Domain Specialist Allocation (15 Questions Each):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {members.map((m, idx) => {
                  const dom = DOMAIN_OPTIONS.find((d) => d.id === m.domain);
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-black/40 border border-red-900/30 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-red-400 font-mono font-bold">
                          <span>{dom?.suit}</span>
                          <span>{m.domain}</span>
                          {m.isLeader && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                              LEAD
                            </span>
                          )}
                        </div>
                        <div className="font-medium text-sm text-zinc-100 mt-0.5">
                          {m.name}
                        </div>
                      </div>
                      <span className="text-lg">{dom?.icon}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Borderland Warning Notice */}
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-xs text-red-300 font-mono mb-8 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>
                By submitting, your team agrees to the Borderland rules. Domains are locked until the respective phase begins. Concurrency engine safely records all 25-30 teams in real time.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playCardClick();
                  setCurrentStep(2);
                }}
                className="px-5 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-xs text-zinc-300 font-mono hover:border-red-500 transition-all"
              >
                ← BACK TO SQUAD
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitRegistration}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-sheepman tracking-[0.2em] text-base uppercase shadow-[0_4px_14px_rgba(255,17,58,0.25)] hover:shadow-[0_6px_20px_rgba(255,17,58,0.35)] hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer"
              >
                {isSubmitting ? "Locking Registration..." : "Lock Registration"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: VISA GRANTED & BORDERLAND PASS SCREEN                              */}
      {/* ========================================================================= */}
      {currentStep === 4 && registeredTeam && (
        <div className="flex flex-col items-center animate-fadeIn">
          {/* Alice in Borderland Visa Clearance Banner */}
          <div className="relative mb-8 text-center">
            <div className="inline-block px-6 py-2 rounded-full bg-red-600/20 border border-red-500 text-red-400 font-mono text-xs uppercase tracking-widest mb-3 animate-pulse">
              ● GAME PROTOCOL APPROVED
            </div>
            <h2 className="font-baroque text-5xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-400">
              VISA GRANTED
            </h2>
            <div className="font-sheepman text-2xl text-red-500 tracking-widest uppercase mt-1">
              ARENA VISA • TOURNAMENT PASS ISSUED
            </div>
          </div>

          {/* Official Holographic Borderland Playing Card Pass */}
          <div className="w-full max-w-xl rounded-2xl p-6 sm:p-8 playing-card-parchment foil-glitter shadow-2xl relative select-none">
            {/* Top Card Bar */}
            <div className="flex items-start justify-between border-b border-amber-900/30 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <ClubEmblem size={32} />
                <div>
                  <div className="font-techno text-[11px] text-red-800 font-black tracking-widest uppercase">
                    TECHNOVATION PRESENTS
                  </div>
                  <div className="font-baroque text-2xl text-stone-900">
                    CoderLands Official Pass
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-sheepman text-xl text-red-800 font-black">
                  {registeredTeam.id}
                </div>
                <div className="font-mono text-[10px] text-stone-600">TEAM REG ID</div>
              </div>
            </div>

            {/* Squad Identity */}
            <div className="my-4 text-center">
              <div className="text-xs font-mono text-stone-600 uppercase font-semibold">
                Authorized Squad Unit:
              </div>
              <div className="font-sheepman text-3xl sm:text-4xl text-zinc-950 uppercase font-black tracking-wide my-1">
                {registeredTeam.teamName}
              </div>
              <div className="font-mono text-xs text-red-900 font-bold uppercase">
                Club: {registeredTeam.clubName}
              </div>
            </div>

            {/* Secret Login Passcode Box for Main Quiz Site */}
            <div className="my-5 p-4 rounded-xl bg-zinc-950 text-zinc-100 border-2 border-red-600 shadow-md flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">
                  MAIN SITE QUIZ ACCESS CODE:
                </div>
                <div className="font-mono text-2xl font-black text-white tracking-widest">
                  {registeredTeam.passcode}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                  Use this Team ID + Passcode for quiz login on 26th-27th.
                </div>
              </div>
              <button
                type="button"
                onClick={copyCredentials}
                className="p-3 rounded-lg bg-red-700 hover:bg-red-600 text-white transition-all"
                title="Copy Team Credentials"
              >
                {copiedCode ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* Domain Specialists Roster */}
            <div className="mb-4">
              <div className="text-xs font-mono text-stone-800 uppercase font-bold mb-2">
                Active Domain Representatives:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-body">
                <div className="p-2.5 rounded-lg bg-amber-900/10 border border-amber-900/20">
                  <span className="font-bold text-red-900 block font-mono text-[11px]">
                    🌐 Web Development:
                  </span>
                  <span className="text-stone-900 font-medium">
                    {registeredTeam.domainMap.webDev}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-900/10 border border-amber-900/20">
                  <span className="font-bold text-red-900 block font-mono text-[11px]">
                    🛡️ Cybersecurity:
                  </span>
                  <span className="text-stone-900 font-medium">
                    {registeredTeam.domainMap.cybersecurity}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-900/10 border border-amber-900/20">
                  <span className="font-bold text-red-900 block font-mono text-[11px]">
                    ☁️ Cloud Computing:
                  </span>
                  <span className="text-stone-900 font-medium">
                    {registeredTeam.domainMap.cloud}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-900/10 border border-amber-900/20">
                  <span className="font-bold text-red-900 block font-mono text-[11px]">
                    🔗 Networking:
                  </span>
                  <span className="text-stone-900 font-medium">
                    {registeredTeam.domainMap.networking}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-amber-900/20 text-xs font-mono text-stone-600">
              <span>VENUE: SEMINAR HALL 1 (Raman Block)</span>
              <span className="font-bold text-red-800">VISA VALID</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={copyCredentials}
              className="px-6 py-3 rounded-xl bg-black/70 border border-red-700 text-red-300 font-mono text-xs hover:border-red-500 transition-all flex items-center gap-2"
            >
              {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? "CREDENTIALS COPIED!" : "COPY TEAM VISA CREDENTIALS"}</span>
            </button>

            <button
              onClick={() => {
                window.print();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 text-white font-sheepman tracking-widest text-xs uppercase shadow-laser hover:scale-105 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>PRINT / SAVE TEAM VISA CARD</span>
            </button>

            <button
              onClick={() => {
                setCurrentStep(1);
                setClubName("");
                setTeamName("");
                setRegisteredTeam(null);
              }}
              className="px-5 py-3 rounded-xl bg-stone-900/80 border border-zinc-700 text-zinc-400 font-mono text-xs hover:text-white transition-all"
            >
              REGISTER ANOTHER SQUAD
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
