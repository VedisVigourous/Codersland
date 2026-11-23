"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, MotionConfig } from "framer-motion";
import ArenaHeader from "./ArenaHeader";
import ArenaIntro from "./ArenaIntro";
import ClubEmblem from "./ClubEmblem";
import RoyalDirectCard from "./RoyalDirectCard";
import OrganizerModal from "./OrganizerModal";
import MobileScrollStage from "./MobileScrollStage";
import VisaPasscardView from "./VisaPasscardView";
import { sounds } from "@/lib/sounds";
import confetti from "canvas-confetti";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Crown,
  Flame,
  Shield,
} from "lucide-react";

export type DomainType = "Web Development" | "Cybersecurity" | "Cloud" | "Networking";

export interface MemberData {
  name: string;
  email: string;
  phone: string;
  isLeader: boolean;
  domain: DomainType;
}

const CHAPTERS = [
  { id: 0, label: "Intro", scrollTarget: 0 },
  { id: 1, label: "Briefing", scrollTarget: 0.16 },
  { id: 2, label: "Team", scrollTarget: 0.36 },
  { id: 3, label: "Squad Alpha", scrollTarget: 0.58 },
  { id: 4, label: "Squad Bravo", scrollTarget: 0.78 },
  { id: 5, label: "Review", scrollTarget: 0.96 },
];

export default function ContinuousScrollStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sound state
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  // Focused Card in the current pair on table
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);

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

  // Scroll Progress across 600vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // As soon as user starts scrolling again, smoothly return card to its space
    setFocusedCardId(null);

    if (latest < 0.12) setActiveChapter(0);
    else if (latest < 0.30) setActiveChapter(1);
    else if (latest < 0.50) setActiveChapter(2);
    else if (latest < 0.70) setActiveChapter(3);
    else if (latest < 0.88) setActiveChapter(4);
    else setActiveChapter(5);
  });

  useEffect(() => {
    containerRef.current?.querySelectorAll<HTMLElement>("[data-arena-chapter]").forEach((stage) => {
      stage.inert = Number(stage.dataset.arenaChapter) !== activeChapter;
    });
  }, [activeChapter, registeredTeam]);

  useEffect(() => {
    sounds.setEnabled(true);

    const audio = document.createElement("audio");
    audio.preload = "auto";
    audio.src = "/themesong.mp3";
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;

    const playAudio = () => {
      if (!audioRef.current) return;
      sounds.unlock();
      audioRef.current
        .play()
        .then(() => {
          setAudioEnabled(true);
          sounds.setEnabled(true);
          cleanupInteractions();
        })
        .catch(() => {
          // Handled if browser blocks initial autoplay before interaction
        });
    };

    const cleanupInteractions = () => {
      window.removeEventListener("click", playAudio);
      window.removeEventListener("touchstart", playAudio);
      window.removeEventListener("scroll", playAudio);
      window.removeEventListener("keydown", playAudio);
      window.removeEventListener("pointerdown", playAudio);
    };

    // 1. Attempt immediate autoplay when page loads
    playAudio();

    // 2. Instant fallback: on very first interaction (click, tap, scroll, key), start music
    window.addEventListener("click", playAudio, { once: true });
    window.addEventListener("touchstart", playAudio, { once: true });
    window.addEventListener("scroll", playAudio, { once: true });
    window.addEventListener("keydown", playAudio, { once: true });
    window.addEventListener("pointerdown", playAudio, { once: true });

    const onPlaying = () => {
      if (audio.paused) return;
      sounds.setEnabled(true);
      setAudioEnabled(true);
    };
    const onStopped = () => {
      if (audio.paused) {
        sounds.setEnabled(false);
        setAudioEnabled(false);
      }
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onStopped);
    audio.addEventListener("error", onStopped);

    return () => {
      cleanupInteractions();
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onStopped);
      audio.removeEventListener("error", onStopped);
      audio.pause();
      sounds.setEnabled(false);
      audioRef.current = null;
    };
  }, []);

  // Escape key & wheel/scroll dismiss: as soon as user starts scrolling, card moves back to its space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFocusedCardId(null);
      }
    };
    const handleScrollDismiss = () => {
      setFocusedCardId((prev) => (prev ? null : null));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollDismiss, { passive: true });
    window.addEventListener("wheel", handleScrollDismiss, { passive: true });
    window.addEventListener("touchmove", handleScrollDismiss, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollDismiss);
      window.removeEventListener("wheel", handleScrollDismiss);
      window.removeEventListener("touchmove", handleScrollDismiss);
    };
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      sounds.setEnabled(false);
      setAudioEnabled(false);
      return;
    }

    // Call play in the click handler so browsers recognize the user gesture.
    audio.play().catch(() => {
      if (audioRef.current !== audio || !audio.paused) return;
      sounds.setEnabled(false);
      setAudioEnabled(false);
    });
    sounds.unlock();
  };

  const updateMember = (index: number, field: keyof MemberData, value: any) => {
    setMembers((prev) => {
      const updated = [...prev];
      if (field === "isLeader" && value === true) {
        updated.forEach((m, i) => {
          m.isLeader = i === index;
        });
      } else if (field === "domain") {
        const targetDomain = value as DomainType;
        const prevIdx = updated.findIndex((m, i) => i !== index && m.domain === targetDomain);
        if (prevIdx !== -1) {
          updated[prevIdx].domain = updated[index].domain;
        }
        updated[index].domain = targetDomain;
      } else {
        (updated[index] as any)[field] = value;
      }
      return updated;
    });
  };

  const scrollToChapter = (targetProgress: number) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: totalHeight * targetProgress,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  // =========================================================================
  // SCROLL-LINKED 3D TRANSFORMS
  // =========================================================================

  // Chapter 0: Dramatic 3D Intro ("Technovation Presents CoderLands")
  // Explodes forward through camera on scroll [0.05 -> 0.16]
  const introScale = useTransform(scrollYProgress, [0.03, 0.15], [1, 1.035]);
  const introOpacity = useTransform(scrollYProgress, [0.06, 0.14], [1, 0]);

  // Chapter 1: 3 Royal Briefing Cards (Enter from depth [0.08 -> 0.16], Exit to edges [0.24 -> 0.35])
  const briefingEnterScale = useTransform(scrollYProgress, [0.08, 0.16], [0.75, 1]);
  const briefingEnterOpacity = useTransform(scrollYProgress, [0.08, 0.15], [0, 1]);

  const briefingLeftX = useTransform(scrollYProgress, [0.24, 0.35], [0, -490]);
  const briefingLeftRotate = useTransform(scrollYProgress, [0.24, 0.35], [-7, -24]);
  const briefingLeftScale = useTransform(scrollYProgress, [0.24, 0.35], [1, 0.78]);

  const briefingRightX = useTransform(scrollYProgress, [0.24, 0.35], [0, 490]);
  const briefingRightRotate = useTransform(scrollYProgress, [0.24, 0.35], [7, 24]);
  const briefingRightScale = useTransform(scrollYProgress, [0.24, 0.35], [1, 0.78]);

  const briefingCenterY = useTransform(scrollYProgress, [0.24, 0.33], [0, -180]);
  const briefingCenterScale = useTransform(scrollYProgress, [0.24, 0.33], [1, 0.75]);
  const briefingCenterOpacity = useTransform(scrollYProgress, [0.24, 0.33], [1, 0]);

  // Chapter 2: Identity Cards (Enter [0.26 -> 0.35], Exit to edges [0.44 -> 0.54])
  const identityInY = useTransform(scrollYProgress, [0.26, 0.35], [350, 0]);
  const identityOpacity = useTransform(scrollYProgress, [0.26, 0.33], [0, 1]);

  const identityClubX = useTransform(scrollYProgress, [0.44, 0.54], [0, -490]);
  const identityClubRotate = useTransform(scrollYProgress, [0.44, 0.54], [-6, -20]);
  const identityClubScale = useTransform(scrollYProgress, [0.44, 0.54], [1, 0.76]);

  const identityTeamX = useTransform(scrollYProgress, [0.44, 0.54], [0, 490]);
  const identityTeamRotate = useTransform(scrollYProgress, [0.44, 0.54], [6, 20]);
  const identityTeamScale = useTransform(scrollYProgress, [0.44, 0.54], [1, 0.76]);

  // Chapter 3: Squad Alpha (WebDev & Cyber) (Enter [0.46 -> 0.55], Exit [0.64 -> 0.74])
  const squadAlphaInY = useTransform(scrollYProgress, [0.46, 0.55], [350, 0]);
  const squadAlphaOpacity = useTransform(scrollYProgress, [0.46, 0.53], [0, 1]);

  const squadAlphaLeftX = useTransform(scrollYProgress, [0.64, 0.74], [0, -470]);
  const squadAlphaLeftRotate = useTransform(scrollYProgress, [0.64, 0.74], [-6, -22]);
  const squadAlphaLeftScale = useTransform(scrollYProgress, [0.64, 0.74], [1, 0.74]);

  const squadAlphaRightX = useTransform(scrollYProgress, [0.64, 0.74], [0, 470]);
  const squadAlphaRightRotate = useTransform(scrollYProgress, [0.64, 0.74], [6, 22]);
  const squadAlphaRightScale = useTransform(scrollYProgress, [0.64, 0.74], [1, 0.74]);

  // Chapter 4: Squad Bravo (Cloud & Net) (Enter [0.66 -> 0.75], Exit [0.82 -> 0.90])
  const squadBravoInY = useTransform(scrollYProgress, [0.66, 0.75], [350, 0]);
  const squadBravoOpacity = useTransform(scrollYProgress, [0.66, 0.73], [0, 1]);

  const squadBravoLeftX = useTransform(scrollYProgress, [0.82, 0.90], [0, -460]);
  const squadBravoLeftRotate = useTransform(scrollYProgress, [0.82, 0.90], [-6, -20]);
  const squadBravoLeftScale = useTransform(scrollYProgress, [0.82, 0.90], [1, 0.72]);

  const squadBravoRightX = useTransform(scrollYProgress, [0.82, 0.90], [0, 460]);
  const squadBravoRightRotate = useTransform(scrollYProgress, [0.82, 0.90], [6, 20]);
  const squadBravoRightScale = useTransform(scrollYProgress, [0.82, 0.90], [1, 0.72]);

  // Chapter 5: Final Visa Clearance Dossier (0.86 -> 1.0)
  const dossierOpacity = useTransform(scrollYProgress, [0.86, 0.93], [0, 1]);
  const dossierScale = useTransform(scrollYProgress, [0.86, 0.94], [0.88, 1]);
  const dossierY = useTransform(scrollYProgress, [0.86, 0.94], [70, 0]);

  // Final Registration Submit
  const handleSubmit = async () => {
    if (!clubName.trim()) {
      setErrorMessage("Please enter Club Name.");
      scrollToChapter(0.36);
      return;
    }
    if (!teamName.trim()) {
      setErrorMessage("Please enter Team Name.");
      scrollToChapter(0.36);
      return;
    }
    for (let i = 0; i < 4; i++) {
      if (!members[i].name.trim()) {
        setErrorMessage(`Player #${i + 1} name is missing. Please enter all 4 player names.`);
        return;
      }
      const email = members[i].email.trim().toLowerCase();
      if (!email) {
        setErrorMessage(`Player #${i + 1} (${members[i].name}) email is missing. Only @abes.ac.in emails are allowed.`);
        return;
      }
      if (!email.endsWith("@abes.ac.in")) {
        setErrorMessage(`Player #${i + 1} (${members[i].name}) email must be an official @abes.ac.in address.`);
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
        throw new Error(data.error || "Arena server rejected registration.");
      }

      setRegisteredTeam(data.team);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      sounds.playVisaGranted();
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#ff113a", "#d6001c", "#f4ede0", "#c5a059"],
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please retry.");
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

  // If registration is complete, render ONLY the isolated Visa Passcard screen!
  if (registeredTeam) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto arena-visa-screen">
        <VisaPasscardView
          registeredTeam={registeredTeam}
          onReset={() => {
            sounds.playCardClick();
            setRegisteredTeam(null);
            setClubName("");
            setTeamName("");
            setMembers([
              { name: "", email: "", phone: "", isLeader: true, domain: "Web Development" },
              { name: "", email: "", phone: "", isLeader: false, domain: "Cybersecurity" },
              { name: "", email: "", phone: "", isLeader: false, domain: "Cloud" },
              { name: "", email: "", phone: "", isLeader: false, domain: "Networking" },
            ]);
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
          audioEnabled={audioEnabled}
          toggleSound={toggleSound}
          onOpenOrganizer={() => setIsOrganizerOpen(true)}
        />
        <OrganizerModal isOpen={isOrganizerOpen} onClose={() => setIsOrganizerOpen(false)} />
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      {/* Protected Organizer Desk Modal (shared across mobile and desktop) */}
      <OrganizerModal isOpen={isOrganizerOpen} onClose={() => setIsOrganizerOpen(false)} />

      {/* ===================================================================== */}
      {/* MOBILE RESPONSIVE VIEW (Minimalist Single-Card Scroll Sequence)       */}
      {/* ===================================================================== */}
      <div className="arena-compact-view">
        <MobileScrollStage
          clubName={clubName}
          setClubName={setClubName}
          teamName={teamName}
          setTeamName={setTeamName}
          members={members}
          updateMember={updateMember}
          audioEnabled={audioEnabled}
          toggleSound={toggleSound}
          onOpenOrganizer={() => setIsOrganizerOpen(true)}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          registeredTeam={registeredTeam}
          copiedCode={copiedCode}
          copyCredentials={copyCredentials}
        />
      </div>

      {/* ===================================================================== */}
      {/* DESKTOP VIEW (600vh Continuous 3D Arena with Fanned Cards & Motion)   */}
      {/* ===================================================================== */}
      <div ref={containerRef} className="arena-desktop-view relative w-full h-[600vh]">
        {/* ===================================================================== */}
        {/* FIXED VIEWPORT: CANVAS & HEADER                                      */}
        {/* ===================================================================== */}
        <div className="arena-viewport fixed inset-0 flex flex-col overflow-hidden z-10 select-none">
        {/* =================================================================== */}
        {/* UNIFIED SLEEK TOP NAVIGATION BAR                                    */}
        {/* =================================================================== */}
        <ArenaHeader audioEnabled={audioEnabled} toggleSound={toggleSound} onOpenOrganizer={() => setIsOrganizerOpen(true)}>
          <nav className="arena-chapter-nav" aria-label="Registration chapters">
            {CHAPTERS.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => scrollToChapter(chapter.scrollTarget)}
                aria-current={activeChapter === chapter.id ? "step" : undefined}
              >
                {chapter.label}
              </button>
            ))}
          </nav>
        </ArenaHeader>

        {/* Global Error Toast */}
        {errorMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-xl bg-red-950/90 border border-red-600 text-red-200 text-xs font-mono flex items-center gap-2 backdrop-blur-md shadow-laser animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =================================================================== */}
        {/* 3D CANVAS FOR ALL CARDS                                             */}
        {/* =================================================================== */}
        <div className="relative min-h-0 flex-1 w-full mx-auto flex items-center justify-center preserve-3d">
          {/* ================================================================= */}
          {/* STAGE 0: DRAMATIC 3D "TECHNOVATION PRESENTS CODERLANDS" OPENING   */}
          {/* Explodes forward through camera on scroll                         */}
          {/* ================================================================= */}
          <motion.div
            style={{ scale: introScale, opacity: introOpacity }}
            className="arena-desktop-intro absolute inset-0 z-30"
            data-arena-chapter="0"
          >
            <ArenaIntro
              onRegister={() => scrollToChapter(CHAPTERS[2].scrollTarget)}
              onBriefing={() => scrollToChapter(CHAPTERS[1].scrollTarget)}
            />
          </motion.div>

          {/* Transparent Dismiss Click-Catcher when Card is Focused (Zero Blur, Zero Dimming) */}
          {focusedCardId && (
            <div
              onClick={() => {
                sounds.playCardClick();
                setFocusedCardId(null);
              }}
              className="fixed inset-0 z-40 bg-transparent cursor-default"
            />
          )}

          {/* ================================================================= */}
          {/* STAGE 1: BRIEFING DECK (FOURFOLD, SEMINAR HALL 1, GAMBiT)         */}
          {/* Overlapping in center like poster, then moves half-out to sides   */}
          {/* ================================================================= */}
          <motion.div
            data-arena-chapter="1"
            style={{
              scale: briefingEnterScale,
              opacity: briefingEnterOpacity,
            }}
            className={`absolute inset-0 flex items-center justify-center transition-all ${
              activeChapter !== 1 ? "pointer-events-none" : ""
            }`}
          >
            {/* Left Card: Round 1 FOURFOLD */}
            <motion.div
              style={{
                x: briefingLeftX,
                rotateZ: briefingLeftRotate,
                scale: briefingLeftScale,
                zIndex: 15,
              }}
              className="absolute pointer-events-auto"
            >
              <RoyalDirectCard
                rank="A"
                suit="♠"
                category="Round 1"
                title="FOURFOLD"
                subtitle="Four technical domains and team debugging"
                footerText="Top 10 teams advance"
                width="w-[288px] xl:w-[302px]"
                height="h-[380px] xl:h-[410px]"
                baseTranslateX={-310}
                zIndex={15}
              />
            </motion.div>

            {/* Center Card: Venue SEMINAR HALL 1 */}
            <motion.div
              style={{
                y: briefingCenterY,
                scale: briefingCenterScale,
                opacity: briefingCenterOpacity,
                zIndex: 35,
              }}
              className="absolute pointer-events-auto"
            >
              <RoyalDirectCard
                rank="A"
                suit="♠"
                category="Venue"
                title="SEMINAR HALL 1"
                subtitle="Raman Block"
                footerText="26–27 November 2026"
                width="w-[288px] xl:w-[302px]"
                height="h-[380px] xl:h-[410px]"
                zIndex={35}
              />
            </motion.div>

            {/* Right Card: Round 2 GAMBiT */}
            <motion.div
              style={{
                x: briefingRightX,
                rotateZ: briefingRightRotate,
                scale: briefingRightScale,
                zIndex: 15,
              }}
              className="absolute pointer-events-auto"
            >
              <RoyalDirectCard
                rank="A"
                suit="♥"
                category="Round 2"
                title="GAMBiT"
                subtitle="Surprise topic, pitch & judges’ Q&A"
                footerText="5 min prep · 2 min pitch · 3 min Q&A"
                width="w-[288px] xl:w-[302px]"
                height="h-[380px] xl:h-[410px]"
                baseTranslateX={310}
                zIndex={15}
              />
            </motion.div>
          </motion.div>

          {/* ================================================================= */}
          {/* STAGE 2: IDENTITY PAIR (DIRECT FRONT-FACE INPUTS)                 */}
          {/* Overlapping in hand, then moves half-out to sides                 */}
          {/* ================================================================= */}
          <motion.div
            data-arena-chapter="2"
            style={{
              opacity: identityOpacity,
              y: identityInY,
            }}
            className={`absolute inset-0 flex items-center justify-center ${
              activeChapter === 2 ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            {/* Left Card: CLUB NAME */}
            <motion.div
              style={{
                x: identityClubX,
                rotateZ: identityClubRotate,
                scale: identityClubScale,
                zIndex: focusedCardId === "club" ? 80 : (focusedCardId === "team" ? 20 : 35),
              }}
              onClick={() => {
                sounds.playCardClick();
                setFocusedCardId("club");
              }}
              className="absolute pointer-events-auto"
            >
              <RoyalDirectCard
                rank="K"
                suit="♥"
                category="Affiliation"
                title="CLUB NAME"
                isFocused={focusedCardId === "club"}
                isSiblingFocused={focusedCardId === "team"}
                onFocusCard={() => setFocusedCardId("club")}
                baseRotate={-6}
                baseTranslateX={-156}
                zIndex={focusedCardId === "club" ? 80 : 35}
                footerText="CARD I // CLUB"
              >
                <div className="space-y-2.5 text-left">
                  <label className="text-[10px] font-mono uppercase font-bold text-stone-800 block">
                    Enter Club Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Club Name"
                    value={clubName}
                    onFocus={() => setFocusedCardId("club")}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 font-medium text-xs sm:text-sm outline-none"
                  />
                  <p className="text-[10px] text-stone-600 font-body bg-amber-900/10 p-2 rounded leading-tight">
                    Must represent your registered university society, student chapter, or independent team.
                  </p>
                </div>
              </RoyalDirectCard>
            </motion.div>

            {/* Right Card: TEAM NAME */}
            <motion.div
              style={{
                x: identityTeamX,
                rotateZ: identityTeamRotate,
                scale: identityTeamScale,
                zIndex: focusedCardId === "team" ? 80 : (focusedCardId === "club" ? 20 : 30),
              }}
              onClick={() => {
                sounds.playCardClick();
                setFocusedCardId("team");
              }}
              className="absolute pointer-events-auto"
            >
              <RoyalDirectCard
                rank="A"
                suit="♠"
                category="Squad Unit"
                title="TEAM NAME"
                isFocused={focusedCardId === "team"}
                isSiblingFocused={focusedCardId === "club"}
                onFocusCard={() => setFocusedCardId("team")}
                baseRotate={6}
                baseTranslateX={156}
                zIndex={focusedCardId === "team" ? 80 : 30}
                footerText="CARD II // TEAM"
              >
                <div className="space-y-2.5 text-left">
                  <label className="text-[10px] font-mono uppercase font-bold text-stone-800 block">
                    Choose Squad Moniker:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Flush, Binary Knights"
                    value={teamName}
                    onFocus={() => setFocusedCardId("team")}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 font-medium text-xs sm:text-sm outline-none"
                  />
                  <p className="text-[10px] text-stone-600 font-body bg-amber-900/10 p-2 rounded leading-tight">
                    This moniker will be displayed on tournament leaderboards and credentials during live arena rounds.
                  </p>
                </div>
              </RoyalDirectCard>
            </motion.div>
          </motion.div>

          {/* ================================================================= */}
          {/* STAGE 3: SQUAD ALPHA (WEBDEV & CYBERSECURITY DIRECT INPUTS)       */}
          {/* Overlapping in hand, then moves half-out to sides                 */}
          {/* ================================================================= */}
          <motion.div
            data-arena-chapter="3"
            style={{
              opacity: squadAlphaOpacity,
              y: squadAlphaInY,
            }}
            className={`absolute inset-0 flex items-center justify-center ${
              activeChapter === 3 ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            {/* Player 1: Web Development ♠ */}
            <motion.div
              style={{
                x: squadAlphaLeftX,
                rotateZ: squadAlphaLeftRotate,
                scale: squadAlphaLeftScale,
                zIndex: focusedCardId === "m0" ? 80 : (focusedCardId === "m1" ? 20 : 35),
              }}
              onClick={() => {
                sounds.playCardClick();
                setFocusedCardId("m0");
              }}
              className="absolute pointer-events-auto"
            >
              <RoyalDirectCard
                rank="I"
                suit="♠"
                category="Domain Specialist"
                title="WEBDEV"
                isFocused={focusedCardId === "m0"}
                isSiblingFocused={focusedCardId === "m1"}
                onFocusCard={() => setFocusedCardId("m0")}
                baseRotate={-6}
                baseTranslateX={-156}
                zIndex={focusedCardId === "m0" ? 80 : 35}
                footerText="15 QUESTIONS // REALM 1"
              >
                <div className="space-y-2 text-left">
                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                      Member Full Name: *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Arisu Ryohei"
                      value={members[0].name}
                      onFocus={() => setFocusedCardId("m0")}
                      onChange={(e) => updateMember(0, "name", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                      College Email (@abes.ac.in): *
                    </label>
                    <input
                      type="email"
                      placeholder="student@abes.ac.in"
                      value={members[0].email}
                      onFocus={() => setFocusedCardId("m0")}
                      onChange={(e) => updateMember(0, "email", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                    />
                  </div>
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playCardClick();
                        updateMember(0, "isLeader", true);
                        setFocusedCardId("m0");
                      }}
                      className={`w-full py-1.5 rounded text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                        members[0].isLeader
                          ? "bg-amber-500 text-stone-950 shadow ring-1 ring-amber-600"
                          : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                      }`}
                    >
                      {members[0].isLeader ? "★ DESIGNATED TEAM LEADER" : "SELECT AS TEAM LEADER"}
                    </button>
                  </div>
                </div>
              </RoyalDirectCard>
            </motion.div>

            {/* Player 2: Cybersecurity ♣ */}
            <motion.div
              style={{
                x: squadAlphaRightX,
                rotateZ: squadAlphaRightRotate,
                scale: squadAlphaRightScale,
                zIndex: focusedCardId === "m1" ? 80 : (focusedCardId === "m0" ? 20 : 30),
              }}
              onClick={() => {
                sounds.playCardClick();
                setFocusedCardId("m1");
              }}
              className="absolute pointer-events-auto"
            >
              <RoyalDirectCard
                rank="II"
                suit="♣"
                category="Domain Specialist"
                title="CYBERSECURITY"
                isFocused={focusedCardId === "m1"}
                isSiblingFocused={focusedCardId === "m0"}
                onFocusCard={() => setFocusedCardId("m1")}
                baseRotate={6}
                baseTranslateX={156}
                zIndex={focusedCardId === "m1" ? 80 : 30}
                footerText="15 QUESTIONS // REALM 2"
              >
                <div className="space-y-2 text-left">
                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                      Member Full Name: *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Yuzuha Usagi"
                      value={members[1].name}
                      onFocus={() => setFocusedCardId("m1")}
                      onChange={(e) => updateMember(1, "name", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                      College Email (@abes.ac.in): *
                    </label>
                    <input
                      type="email"
                      placeholder="student@abes.ac.in"
                      value={members[1].email}
                      onFocus={() => setFocusedCardId("m1")}
                      onChange={(e) => updateMember(1, "email", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                    />
                  </div>
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playCardClick();
                        updateMember(1, "isLeader", true);
                        setFocusedCardId("m1");
                      }}
                      className={`w-full py-1.5 rounded text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                        members[1].isLeader
                          ? "bg-amber-500 text-stone-950 shadow ring-1 ring-amber-600"
                          : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                      }`}
                    >
                      {members[1].isLeader ? "★ DESIGNATED TEAM LEADER" : "SELECT AS TEAM LEADER"}
                    </button>
                  </div>
                </div>
              </RoyalDirectCard>
            </motion.div>
          </motion.div>

          {/* ================================================================= */}
          {/* STAGE 4: SQUAD BRAVO (CLOUD & NETWORKING DIRECT INPUTS)           */}
          {/* Overlapping in hand, then moves half-out to sides                 */}
          {/* ================================================================= */}
          <motion.div
            data-arena-chapter="4"
            style={{
              opacity: squadBravoOpacity,
              y: squadBravoInY,
            }}
            className={`absolute inset-0 flex items-center justify-center ${
              activeChapter === 4 ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            {/* Player 3: Cloud Computing ♦ */}
            <motion.div
              style={{
                x: squadBravoLeftX,
                rotateZ: squadBravoLeftRotate,
                scale: squadBravoLeftScale,
                zIndex: focusedCardId === "m2" ? 80 : (focusedCardId === "m3" ? 20 : 35),
              }}
              onClick={() => {
                sounds.playCardClick();
                setFocusedCardId("m2");
              }}
              className="absolute pointer-events-auto"
            >
              <RoyalDirectCard
                rank="III"
                suit="♦"
                category="Domain Specialist"
                title="CLOUD"
                isFocused={focusedCardId === "m2"}
                isSiblingFocused={focusedCardId === "m3"}
                onFocusCard={() => setFocusedCardId("m2")}
                baseRotate={-6}
                baseTranslateX={-156}
                zIndex={focusedCardId === "m2" ? 80 : 35}
                footerText="15 QUESTIONS // REALM 3"
              >
                <div className="space-y-2 text-left">
                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                      Member Full Name: *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Shuntaro Chishiya"
                      value={members[2].name}
                      onFocus={() => setFocusedCardId("m2")}
                      onChange={(e) => updateMember(2, "name", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                      College Email (@abes.ac.in): *
                    </label>
                    <input
                      type="email"
                      placeholder="student@abes.ac.in"
                      value={members[2].email}
                      onFocus={() => setFocusedCardId("m2")}
                      onChange={(e) => updateMember(2, "email", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                    />
                  </div>
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playCardClick();
                        updateMember(2, "isLeader", true);
                        setFocusedCardId("m2");
                      }}
                      className={`w-full py-1.5 rounded text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                        members[2].isLeader
                          ? "bg-amber-500 text-stone-950 shadow ring-1 ring-amber-600"
                          : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                      }`}
                    >
                      {members[2].isLeader ? "★ DESIGNATED TEAM LEADER" : "SELECT AS TEAM LEADER"}
                    </button>
                  </div>
                </div>
              </RoyalDirectCard>
            </motion.div>

            {/* Player 4: Networking ♥ */}
            <motion.div
              style={{
                x: squadBravoRightX,
                rotateZ: squadBravoRightRotate,
                scale: squadBravoRightScale,
                zIndex: focusedCardId === "m3" ? 80 : (focusedCardId === "m2" ? 20 : 30),
              }}
              onClick={() => {
                sounds.playCardClick();
                setFocusedCardId("m3");
              }}
              className="absolute pointer-events-auto"
            >
              <RoyalDirectCard
                rank="IV"
                suit="♥"
                category="Domain Specialist"
                title="NETWORKING"
                isFocused={focusedCardId === "m3"}
                isSiblingFocused={focusedCardId === "m2"}
                onFocusCard={() => setFocusedCardId("m3")}
                baseRotate={6}
                baseTranslateX={156}
                zIndex={focusedCardId === "m3" ? 80 : 30}
                footerText="15 QUESTIONS // REALM 4"
              >
                <div className="space-y-2 text-left">
                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                      Member Full Name: *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hikari Kuina"
                      value={members[3].name}
                      onFocus={() => setFocusedCardId("m3")}
                      onChange={(e) => updateMember(3, "name", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                      College Email (@abes.ac.in): *
                    </label>
                    <input
                      type="email"
                      placeholder="student@abes.ac.in"
                      value={members[3].email}
                      onFocus={() => setFocusedCardId("m3")}
                      onChange={(e) => updateMember(3, "email", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                    />
                  </div>
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playCardClick();
                        updateMember(3, "isLeader", true);
                        setFocusedCardId("m3");
                      }}
                      className={`w-full py-1.5 rounded text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                        members[3].isLeader
                          ? "bg-amber-500 text-stone-950 shadow ring-1 ring-amber-600"
                          : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                      }`}
                    >
                      {members[3].isLeader ? "★ DESIGNATED TEAM LEADER" : "SELECT AS TEAM LEADER"}
                    </button>
                  </div>
                </div>
              </RoyalDirectCard>
            </motion.div>
          </motion.div>

          {/* ================================================================= */}
          {/* STAGE 5: FULLY EDITABLE MASTER VISA DOSSIER & CLEARANCE           */}
          {/* All fields editable inline before final confirmation!             */}
          {/* ================================================================= */}
          <motion.div
            data-arena-chapter="5"
            style={{
              opacity: dossierOpacity,
              scale: dossierScale,
              y: dossierY,
            }}
            className={`absolute inset-0 flex items-center justify-center z-40 ${
              activeChapter === 5 ? "pointer-events-auto" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="w-full max-w-2xl mx-auto p-2 relative z-50">
              {!registeredTeam ? (
                /* Fully Editable Master Dossier */
                <div className="arena-dossier rounded-2xl p-5 sm:p-6 playing-card-dark shadow-2xl overflow-y-auto relative z-50" data-lenis-prevent>
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-red-900/40 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <ClubEmblem size={26} />
                      <div>
                        <div className="font-techno text-[10px] text-red-500 uppercase tracking-widest font-bold">
                          TECHNOVATION ARENA CONTRACT
                        </div>
                        <div className="font-baroque text-2xl text-zinc-100">
                          Borderland Visa Application
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-red-400 font-bold">26–27 NOV</span>
                  </div>

                  <p className="text-zinc-400 text-xs font-mono mb-3 text-left">
                    Review and edit any parameter below before locking in your squad visa:
                  </p>

                  {/* Editable Identity Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-left relative z-40">
                    <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 relative z-30">
                      <label className="text-[10px] font-mono text-red-400 uppercase font-bold block mb-1">
                        Club Affiliation:
                      </label>
                      <input
                        type="text"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        placeholder="Enter Club Name"
                        className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 focus:border-red-500 text-zinc-100 text-xs font-mono outline-none select-text cursor-text relative z-40"
                      />
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 relative z-30">
                      <label className="text-[10px] font-mono text-red-400 uppercase font-bold block mb-1">
                        Squad Moniker:
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Enter Squad Moniker"
                        className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 focus:border-red-500 text-zinc-100 text-xs font-mono outline-none select-text cursor-text relative z-40"
                      />
                    </div>
                  </div>

                  {/* Editable 4 Members Section */}
                  <div className="mb-4 text-left">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                      Editable Squad Specialists:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {members.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-black/50 border border-red-900/30 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] text-red-400 font-mono font-bold">
                              {m.domain}:
                            </span>
                            <button
                              type="button"
                              onClick={() => updateMember(idx, "isLeader", true)}
                              className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold transition-all cursor-pointer ${
                                m.isLeader
                                  ? "bg-amber-500 text-stone-950 shadow"
                                  : "bg-zinc-800 text-zinc-400 hover:text-white"
                              }`}
                            >
                              {m.isLeader ? "★ LEADER" : "SET LEAD"}
                            </button>
                          </div>
                          <input
                            type="text"
                            value={m.name}
                            onChange={(e) => updateMember(idx, "name", e.target.value)}
                            placeholder={`Player #${idx + 1} Name`}
                            className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 focus:border-red-500 text-zinc-100 text-xs outline-none mb-1 font-mono"
                          />
                          <input
                            type="email"
                            value={m.email}
                            onChange={(e) => updateMember(idx, "email", e.target.value)}
                            placeholder="student@abes.ac.in"
                            className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-700 focus:border-red-500 text-zinc-300 text-[11px] outline-none font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submission Action */}
                  <div className="pt-2">
                    <button
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white font-sheepman tracking-widest text-sm uppercase shadow-laser hover:scale-102 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>SEALING VISA IN ARENA DATABASE...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>CLAIM TEAM VISA & LOCK REGISTRATION</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Post-Submission VISA GRANTED Passcard */
                <div className="rounded-2xl p-6 playing-card-parchment foil-glitter shadow-2xl border-2 border-stone-400 text-stone-900 animate-fadeIn">
                  <div className="flex items-start justify-between border-b border-amber-900/30 pb-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <ClubEmblem size={28} />
                      <div>
                        <div className="font-techno text-[10px] text-red-800 font-bold uppercase tracking-widest">
                          VISA GRANTED • 14 DAYS
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
                      <div className="text-[9px] font-mono text-stone-600">TEAM REG ID</div>
                    </div>
                  </div>

                  <div className="text-center my-3">
                    <div className="font-sheepman text-3xl text-zinc-950 uppercase font-black">
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
                      className="p-2 rounded bg-red-700 hover:bg-red-600 text-white transition-all cursor-pointer"
                      title="Copy credentials"
                    >
                      {copiedCode ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Specialists roster */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-body text-left mb-3">
                    <div className="p-1.5 rounded bg-amber-900/10">
                      <span className="font-bold text-red-900 block font-mono text-[10px]">WEBDEV:</span>
                      <span className="truncate block">{registeredTeam.domainMap.webDev}</span>
                    </div>
                    <div className="p-1.5 rounded bg-amber-900/10">
                      <span className="font-bold text-red-900 block font-mono text-[10px]">CYBERSECURITY:</span>
                      <span className="truncate block">{registeredTeam.domainMap.cybersecurity}</span>
                    </div>
                    <div className="p-1.5 rounded bg-amber-900/10">
                      <span className="font-bold text-red-900 block font-mono text-[10px]">CLOUD:</span>
                      <span className="truncate block">{registeredTeam.domainMap.cloud}</span>
                    </div>
                    <div className="p-1.5 rounded bg-amber-900/10">
                      <span className="font-bold text-red-900 block font-mono text-[10px]">NETWORKING:</span>
                      <span className="truncate block">{registeredTeam.domainMap.networking}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-amber-900/20">
                    <button
                      onClick={copyCredentials}
                      className="px-4 py-1.5 rounded-lg bg-black/80 text-white font-mono text-[11px] flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "COPIED" : "COPY PASS"}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-1.5 rounded-lg bg-red-700 text-white font-mono text-[11px] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PRINT CARD</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* =================================================================== */}
        {/* BOTTOM MINIMAL SCROLL HINT                                          */}
        {/* =================================================================== */}
        <footer className="arena-footer">
          <span>{activeChapter === 0 ? "Scroll to explore the arena" : "Scroll or use the chapter navigation"}</span>
          <span>ABES Engineering College · Ghaziabad</span>
        </footer>
      </div>
    </div>
  </MotionConfig>
);
}
