"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import ArenaHeader from "./ArenaHeader";
import ArenaIntro from "./ArenaIntro";
import ClubEmblem from "./ClubEmblem";
import CornerFiligree from "./CornerFiligree";
import { sounds } from "@/lib/sounds";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  ArrowDown,
  ArrowRight,
  Shield,
  Award,
} from "lucide-react";
import type { MemberData } from "./ContinuousScrollStage";

interface MobileScrollStageProps {
  clubName: string;
  setClubName: (name: string) => void;
  teamName: string;
  setTeamName: (name: string) => void;
  members: MemberData[];
  updateMember: (index: number, field: keyof MemberData, value: any) => void;
  audioEnabled: boolean;
  toggleSound: () => void;
  onOpenOrganizer: () => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string | null;
  registeredTeam: any;
  copiedCode: boolean;
  copyCredentials: () => void;
}

export default function MobileScrollStage({
  clubName,
  setClubName,
  teamName,
  setTeamName,
  members,
  updateMember,
  audioEnabled,
  toggleSound,
  onOpenOrganizer,
  handleSubmit,
  isSubmitting,
  errorMessage,
  registeredTeam,
  copiedCode,
  copyCredentials,
}: MobileScrollStageProps) {
  const briefingRef = useRef<HTMLElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const card5Ref = useRef<HTMLDivElement>(null);
  const card6Ref = useRef<HTMLDivElement>(null);
  const dossierRef = useRef<HTMLDivElement>(null);

  const scrollToRef = (ref: React.RefObject<HTMLElement>) => {
    sounds.playCardClick();
    ref.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "center",
    });
  };

  return (
    <div className="arena-compact relative w-full min-h-screen flex flex-col">
      {/* ===================================================================== */}
      {/* STICKY TOP MINIMAL NAV HEADER                                         */}
      {/* ===================================================================== */}
      <ArenaHeader audioEnabled={audioEnabled} toggleSound={toggleSound} onOpenOrganizer={onOpenOrganizer} />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="sticky top-16 z-50 mx-4 mt-2 px-3 py-2 rounded-xl bg-red-950/95 border border-red-600 text-red-200 text-xs font-mono flex items-center gap-2 shadow-laser animate-shake">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1. INTRO HERO SECTION                                                 */}
      {/* ===================================================================== */}
      <section className="arena-compact-intro">
        <ArenaIntro onRegister={() => scrollToRef(card1Ref)} onBriefing={() => scrollToRef(briefingRef)} />
      </section>

      <section className="arena-compact-briefing" ref={briefingRef} aria-labelledby="compact-briefing-title">
        <h2 id="compact-briefing-title" className="font-baroque">Event briefing</h2>
        <div className="arena-rounds">
          <article>
            <p className="arena-kicker">Round 1</p>
            <h3 className="font-sheepman">Fourfold</h3>
            <p>Cloud, networking, cybersecurity and web development, followed by team debugging. The top 10 teams advance.</p>
          </article>
          <article>
            <p className="arena-kicker">Round 2</p>
            <h3 className="font-sheepman">Gambit</h3>
            <p>Get a surprise topic, then use 5 minutes to prepare, 2 to pitch and 3 for judges’ questions.</p>
          </article>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. CARD 1: AFFILIATION // CLUB NAME                                   */}
      {/* ===================================================================== */}
      <section ref={card1Ref} className="arena-compact-stage flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="arena-stage-label">
          CARD 1 OF 6 // AFFILIATION
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          style={{ touchAction: "pan-y" }}
          className="w-[88vw] max-w-[340px] min-h-[460px] rounded-2xl p-5 playing-card-parchment foil-glitter flex flex-col justify-between border-2 border-stone-400/60 shadow-2xl relative"
        >
          {/* Top Row: Corner Indices & Top-Right Filigree */}
          <div className="flex items-start justify-between relative z-20 pointer-events-none">
            <div className="flex flex-col items-center leading-none">
              <span className="font-sheepman text-2xl font-black text-red-700">K</span>
              <span className="text-base font-bold text-red-700">♥</span>
            </div>
            <CornerFiligree size={34} position="top-right" />
          </div>

          {/* Center Content */}
          <div className="my-auto text-center relative z-20 py-1">
            <div className="font-baroque text-2xl text-red-800 font-semibold mb-1">
              Affiliation
            </div>
            <h3 className="font-sheepman text-3xl text-stone-950 font-black uppercase leading-tight mb-2">
              CLUB NAME
            </h3>

            <div className="space-y-2.5 text-left">
              <label className="text-[10px] font-mono uppercase font-bold text-stone-800 block">
                Enter Club Affiliation:
              </label>
              <input
                type="text"
                placeholder="Enter Club Name"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 font-medium text-sm outline-none"
              />
              <p className="text-[10px] text-stone-600 font-body bg-amber-900/10 p-2 rounded leading-tight">
                Must represent your registered university society, student chapter, or independent team.
              </p>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between border-t border-amber-900/25 pt-2 relative z-20 pointer-events-none">
            <div className="flex flex-col items-start">
              <CornerFiligree size={30} position="bottom-left" />
            </div>
            <div className="flex flex-col items-center leading-none rotate-180">
              <span className="font-sheepman text-2xl font-black text-red-700">K</span>
              <span className="text-base font-bold text-red-700">♥</span>
            </div>
          </div>
        </motion.div>

        <button
          onClick={() => scrollToRef(card2Ref)}
          className="mt-4 flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
        >
          <span>Next: Team Name</span>
          <ArrowDown className="w-3.5 h-3.5 text-red-500" />
        </button>
      </section>

      {/* ===================================================================== */}
      {/* 3. CARD 2: SQUAD UNIT // TEAM NAME                                    */}
      {/* ===================================================================== */}
      <section ref={card2Ref} className="arena-compact-stage flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="arena-stage-label">
          CARD 2 OF 6 // SQUAD UNIT
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          style={{ touchAction: "pan-y" }}
          className="w-[88vw] max-w-[340px] min-h-[460px] rounded-2xl p-5 playing-card-parchment foil-glitter flex flex-col justify-between border-2 border-stone-400/60 shadow-2xl relative"
        >
          {/* Top Row */}
          <div className="flex items-start justify-between relative z-20 pointer-events-none">
            <div className="flex flex-col items-center leading-none">
              <span className="font-sheepman text-2xl font-black text-stone-900">A</span>
              <span className="text-base font-bold text-stone-900">♠</span>
            </div>
            <CornerFiligree size={34} position="top-right" />
          </div>

          {/* Center Content */}
          <div className="my-auto text-center relative z-20 py-1">
            <div className="font-baroque text-2xl text-red-800 font-semibold mb-1">
              Squad Unit
            </div>
            <h3 className="font-sheepman text-3xl text-stone-950 font-black uppercase leading-tight mb-2">
              TEAM NAME
            </h3>

            <div className="space-y-2.5 text-left">
              <label className="text-[10px] font-mono uppercase font-bold text-stone-800 block">
                Choose Squad Name:
              </label>
              <input
                type="text"
                placeholder="Enter Squad Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 font-medium text-sm outline-none"
              />
              <p className="text-[10px] text-stone-600 font-body bg-amber-900/10 p-2.5 rounded leading-tight">
                This squad name will be displayed on tournament leaderboards and credentials during live arena rounds.
              </p>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between border-t border-amber-900/25 pt-2 relative z-20 pointer-events-none">
            <div className="flex flex-col items-start">
              <CornerFiligree size={30} position="bottom-left" />
            </div>
            <div className="flex flex-col items-center leading-none rotate-180">
              <span className="font-sheepman text-2xl font-black text-stone-900">A</span>
              <span className="text-base font-bold text-stone-900">♠</span>
            </div>
          </div>
        </motion.div>

        <button
          onClick={() => scrollToRef(card3Ref)}
          className="mt-4 flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
        >
          <span>Next: WebDev Specialist</span>
          <ArrowDown className="w-3.5 h-3.5 text-red-500" />
        </button>
      </section>

      {/* ===================================================================== */}
      {/* 4. CARD 3: DOMAIN SPECIALIST // WEBDEV                                */}
      {/* ===================================================================== */}
      <section ref={card3Ref} className="arena-compact-stage flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="arena-stage-label">
          CARD 3 OF 6 // REALM 1 SPECIALIST
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          style={{ touchAction: "pan-y" }}
          className="w-[88vw] max-w-[340px] min-h-[460px] rounded-2xl p-5 playing-card-parchment foil-glitter flex flex-col justify-between border-2 border-stone-400/60 shadow-2xl relative"
        >
          {/* Top Row */}
          <div className="flex items-start justify-between relative z-20 pointer-events-none">
            <div className="flex flex-col items-center leading-none">
              <span className="font-sheepman text-2xl font-black text-stone-900">I</span>
              <span className="text-base font-bold text-stone-900">♠</span>
            </div>
            <CornerFiligree size={34} position="top-right" />
          </div>

          {/* Center Content */}
          <div className="my-auto text-center relative z-20 py-1">
            <div className="font-baroque text-2xl text-red-800 font-semibold mb-1">
              Domain Specialist
            </div>
            <h3 className="font-sheepman text-3xl text-stone-950 font-black uppercase leading-tight mb-2">
              WEBDEV
            </h3>

            <div className="space-y-2 text-left">
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                  Member Full Name: *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arisu Ryohei"
                  value={members[0].name}
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
                  onChange={(e) => updateMember(0, "email", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                />
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playCardClick();
                    updateMember(0, "isLeader", true);
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
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between border-t border-amber-900/25 pt-2 relative z-20 pointer-events-none">
            <div className="flex flex-col items-start">
              <CornerFiligree size={30} position="bottom-left" />
            </div>
            <div className="flex flex-col items-center leading-none rotate-180">
              <span className="font-sheepman text-2xl font-black text-stone-900">I</span>
              <span className="text-base font-bold text-stone-900">♠</span>
            </div>
          </div>
        </motion.div>

        <button
          onClick={() => scrollToRef(card4Ref)}
          className="mt-4 flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
        >
          <span>Next: Cybersecurity Specialist</span>
          <ArrowDown className="w-3.5 h-3.5 text-red-500" />
        </button>
      </section>

      {/* ===================================================================== */}
      {/* 5. CARD 4: DOMAIN SPECIALIST // CYBERSECURITY                         */}
      {/* ===================================================================== */}
      <section ref={card4Ref} className="arena-compact-stage flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="arena-stage-label">
          CARD 4 OF 6 // REALM 2 SPECIALIST
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          style={{ touchAction: "pan-y" }}
          className="w-[88vw] max-w-[340px] min-h-[460px] rounded-2xl p-5 playing-card-parchment foil-glitter flex flex-col justify-between border-2 border-stone-400/60 shadow-2xl relative"
        >
          {/* Top Row */}
          <div className="flex items-start justify-between relative z-20 pointer-events-none">
            <div className="flex flex-col items-center leading-none">
              <span className="font-sheepman text-2xl font-black text-stone-900">II</span>
              <span className="text-base font-bold text-stone-900">♣</span>
            </div>
            <CornerFiligree size={34} position="top-right" />
          </div>

          {/* Center Content */}
          <div className="my-auto text-center relative z-20 py-1">
            <div className="font-baroque text-2xl text-red-800 font-semibold mb-1">
              Domain Specialist
            </div>
            <h3 className="font-sheepman text-[22px] text-stone-950 font-black uppercase leading-tight mb-2">
              CYBERSECURITY
            </h3>

            <div className="space-y-2 text-left">
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                  Member Full Name: *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Yuzuha Usagi"
                  value={members[1].name}
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
                  onChange={(e) => updateMember(1, "email", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                />
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playCardClick();
                    updateMember(1, "isLeader", true);
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
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between border-t border-amber-900/25 pt-2 relative z-20 pointer-events-none">
            <div className="flex flex-col items-start">
              <CornerFiligree size={30} position="bottom-left" />
            </div>
            <div className="flex flex-col items-center leading-none rotate-180">
              <span className="font-sheepman text-2xl font-black text-stone-900">II</span>
              <span className="text-base font-bold text-stone-900">♣</span>
            </div>
          </div>
        </motion.div>

        <button
          onClick={() => scrollToRef(card5Ref)}
          className="mt-4 flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
        >
          <span>Next: Cloud Specialist</span>
          <ArrowDown className="w-3.5 h-3.5 text-red-500" />
        </button>
      </section>

      {/* ===================================================================== */}
      {/* 6. CARD 5: DOMAIN SPECIALIST // CLOUD                                 */}
      {/* ===================================================================== */}
      <section ref={card5Ref} className="arena-compact-stage flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="arena-stage-label">
          CARD 5 OF 6 // REALM 3 SPECIALIST
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          style={{ touchAction: "pan-y" }}
          className="w-[88vw] max-w-[340px] min-h-[460px] rounded-2xl p-5 playing-card-parchment foil-glitter flex flex-col justify-between border-2 border-stone-400/60 shadow-2xl relative"
        >
          {/* Top Row */}
          <div className="flex items-start justify-between relative z-20 pointer-events-none">
            <div className="flex flex-col items-center leading-none">
              <span className="font-sheepman text-2xl font-black text-red-700">III</span>
              <span className="text-base font-bold text-red-700">♦</span>
            </div>
            <CornerFiligree size={34} position="top-right" />
          </div>

          {/* Center Content */}
          <div className="my-auto text-center relative z-20 py-1">
            <div className="font-baroque text-2xl text-red-800 font-semibold mb-1">
              Domain Specialist
            </div>
            <h3 className="font-sheepman text-3xl text-stone-950 font-black uppercase leading-tight mb-2">
              CLOUD
            </h3>

            <div className="space-y-2 text-left">
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                  Member Full Name: *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shuntaro Chishiya"
                  value={members[2].name}
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
                  onChange={(e) => updateMember(2, "email", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                />
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playCardClick();
                    updateMember(2, "isLeader", true);
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
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between border-t border-amber-900/25 pt-2 relative z-20 pointer-events-none">
            <div className="flex flex-col items-start">
              <CornerFiligree size={30} position="bottom-left" />
            </div>
            <div className="flex flex-col items-center leading-none rotate-180">
              <span className="font-sheepman text-2xl font-black text-red-700">III</span>
              <span className="text-base font-bold text-red-700">♦</span>
            </div>
          </div>
        </motion.div>

        <button
          onClick={() => scrollToRef(card6Ref)}
          className="mt-4 flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
        >
          <span>Next: Networking Specialist</span>
          <ArrowDown className="w-3.5 h-3.5 text-red-500" />
        </button>
      </section>

      {/* ===================================================================== */}
      {/* 7. CARD 6: DOMAIN SPECIALIST // NETWORKING                            */}
      {/* ===================================================================== */}
      <section ref={card6Ref} className="arena-compact-stage flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="arena-stage-label">
          CARD 6 OF 6 // REALM 4 SPECIALIST
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          style={{ touchAction: "pan-y" }}
          className="w-[88vw] max-w-[340px] min-h-[460px] rounded-2xl p-5 playing-card-parchment foil-glitter flex flex-col justify-between border-2 border-stone-400/60 shadow-2xl relative"
        >
          {/* Top Row */}
          <div className="flex items-start justify-between relative z-20 pointer-events-none">
            <div className="flex flex-col items-center leading-none">
              <span className="font-sheepman text-2xl font-black text-red-700">IV</span>
              <span className="text-base font-bold text-red-700">♥</span>
            </div>
            <CornerFiligree size={34} position="top-right" />
          </div>

          {/* Center Content */}
          <div className="my-auto text-center relative z-20 py-1">
            <div className="font-baroque text-2xl text-red-800 font-semibold mb-1">
              Domain Specialist
            </div>
            <h3 className="font-sheepman text-[22px] text-stone-950 font-black uppercase leading-tight mb-2">
              NETWORKING
            </h3>

            <div className="space-y-2 text-left">
              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-stone-700 block mb-0.5">
                  Member Full Name: *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hikari Kuina"
                  value={members[3].name}
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
                  onChange={(e) => updateMember(3, "email", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-stone-100 border border-stone-400 focus:border-red-600 text-stone-950 text-xs outline-none"
                />
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playCardClick();
                    updateMember(3, "isLeader", true);
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
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between border-t border-amber-900/25 pt-2 relative z-20 pointer-events-none">
            <div className="flex flex-col items-start">
              <CornerFiligree size={30} position="bottom-left" />
            </div>
            <div className="flex flex-col items-center leading-none rotate-180">
              <span className="font-sheepman text-2xl font-black text-red-700">IV</span>
              <span className="text-base font-bold text-red-700">♥</span>
            </div>
          </div>
        </motion.div>

        <button
          onClick={() => scrollToRef(dossierRef)}
          className="mt-4 flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
        >
          <span>Final Step: Review & Submit Visa</span>
          <ArrowDown className="w-3.5 h-3.5 text-red-500" />
        </button>
      </section>

      {/* ===================================================================== */}
      {/* 8. MASTER VISA DOSSIER & CLEARANCE (FINAL REVIEW & SUBMIT)            */}
      {/* ===================================================================== */}
      <section ref={dossierRef} className="arena-compact-stage flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="w-full max-w-sm mx-auto">
          {!registeredTeam ? (
            /* Editable Master Dossier */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              style={{ touchAction: "pan-y" }}
              className="arena-dossier rounded-2xl p-5 sm:p-6 bg-[#0d090d]/95 backdrop-blur-xl border-2 border-red-900/60 shadow-[0_0_50px_rgba(255,17,58,0.25),0_25px_60px_rgba(0,0,0,0.95)] relative overflow-hidden"
            >
              {/* Single Line Header: Logo (Left) | Codersland Visa Application (Center) | Date (Right) */}
              <div className="flex items-center justify-between border-b border-red-900/40 pb-3 mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <ClubEmblem size={22} />
                  <span className="font-baroque text-base sm:text-lg text-zinc-100 font-bold tracking-wide">
                    Coderlands Visa Application
                  </span>
                </div>
                <div className="text-right font-mono text-[11px] text-red-400 font-bold tracking-wider">
                  26–27 NOV
                </div>
              </div>

              <p className="text-zinc-400 text-xs font-mono mb-3.5 text-left relative z-10">
                Review and edit any parameter below before locking in your squad visa:
              </p>

              {/* Editable Identity Section */}
              <div className="space-y-2.5 mb-3.5 text-left relative z-40">
                <div className="p-3 rounded-xl bg-black/60 border border-red-900/40 hover:border-red-700/60 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/30 transition-all relative z-30">
                  <label className="text-xs sm:text-[13px] font-mono text-red-400 font-bold tracking-wider block mb-1.5">
                    Club Affiliation
                  </label>
                  <input
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    placeholder="Enter Club Name"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-red-500 text-zinc-100 text-xs font-mono outline-none placeholder:text-zinc-600 placeholder:text-[11px] select-text cursor-text relative z-40 transition-colors"
                  />
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-red-900/40 hover:border-red-700/60 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/30 transition-all relative z-30">
                  <label className="text-xs sm:text-[13px] font-mono text-red-400 font-bold tracking-wider block mb-1.5">
                    Squad Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter Squad Name"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-red-500 text-zinc-100 text-xs font-mono outline-none placeholder:text-zinc-600 placeholder:text-[11px] select-text cursor-text relative z-40 transition-colors"
                  />
                </div>
              </div>

              {/* Editable Specialists */}
              <div className="space-y-2.5 mb-4 text-left relative z-10">
                <div className="text-xs sm:text-[13px] font-mono text-red-400 uppercase tracking-wider mb-2 font-bold">
                  Squad Specialists
                </div>

                {members.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/60 border border-red-900/40 hover:border-red-800/60 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-red-400 tracking-wide">
                        {m.domain}:
                      </span>
                      <button
                        type="button"
                        onClick={() => updateMember(idx, "isLeader", true)}
                        className={`text-[9px] px-2.5 py-1 rounded font-mono font-bold transition-all cursor-pointer ${
                          m.isLeader
                            ? "bg-amber-500 text-stone-950 shadow font-black"
                            : "bg-zinc-800/80 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
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
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-red-500 text-zinc-100 text-xs outline-none mb-1.5 font-mono placeholder:text-zinc-600 placeholder:text-[11px] transition-colors"
                    />
                    <input
                      type="email"
                      value={m.email}
                      onChange={(e) => updateMember(idx, "email", e.target.value)}
                      placeholder="student@abes.ac.in"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-red-500 text-zinc-200 text-xs outline-none font-mono placeholder:text-zinc-600 placeholder:text-[11px] transition-colors"
                    />
                  </div>
                ))}
              </div>

              {/* Submit Action */}
              <button
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-sheepman tracking-[0.2em] text-xs uppercase shadow-[0_4px_14px_rgba(255,17,58,0.25)] hover:shadow-[0_6px_20px_rgba(255,17,58,0.35)] active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer"
              >
                {isSubmitting ? "Locking Registration..." : "Lock Registration"}
              </button>
            </motion.div>
          ) : (
            /* Post-Submission VISA GRANTED Passcard */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl p-5 playing-card-parchment foil-glitter shadow-2xl border-2 border-stone-400 text-stone-900"
            >
              <div className="flex items-start justify-between border-b border-amber-900/30 pb-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <ClubEmblem size={24} />
                  <div>
                    <div className="font-techno text-[9px] text-red-800 font-bold uppercase tracking-widest">
                      CODERLANDS VISA • CONFIRMED
                    </div>
                    <div className="font-baroque text-xl text-stone-900">
                      Coderlands Official Pass
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-sheepman text-base text-red-800 font-black">
                    {registeredTeam.id}
                  </div>
                  <div className="text-[8px] font-mono text-stone-600">TEAM REG ID</div>
                </div>
              </div>

              <div className="text-center my-2">
                <div className="font-sheepman text-2xl text-zinc-950 uppercase font-black">
                  {registeredTeam.teamName}
                </div>
                <div className="text-xs font-mono text-red-900 font-bold">
                  Club: {registeredTeam.clubName}
                </div>
              </div>

              {/* Secret Passcode for Main Quiz Site */}
              <div className="p-2.5 my-2.5 rounded-xl bg-zinc-950 text-zinc-100 border-2 border-red-600 flex items-center justify-between">
                <div>
                  <div className="text-[8px] font-mono text-red-400 uppercase tracking-widest font-bold">
                    MAIN QUIZ ACCESS CODE:
                  </div>
                  <div className="font-mono text-lg font-black text-white tracking-widest">
                    {registeredTeam.passcode}
                  </div>
                </div>
                <button
                  onClick={copyCredentials}
                  className="p-1.5 rounded bg-red-700 hover:bg-red-600 text-white transition-all cursor-pointer"
                  title="Copy credentials"
                >
                  {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Specialists roster */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-body text-left mb-3">
                <div className="p-1.5 rounded bg-amber-900/10">
                  <span className="font-bold text-red-900 block font-mono text-[9px]">WEBDEV:</span>
                  <span className="truncate block">{registeredTeam.domainMap.webDev}</span>
                </div>
                <div className="p-1.5 rounded bg-amber-900/10">
                  <span className="font-bold text-red-900 block font-mono text-[9px]">CYBERSECURITY:</span>
                  <span className="truncate block">{registeredTeam.domainMap.cybersecurity}</span>
                </div>
                <div className="p-1.5 rounded bg-amber-900/10">
                  <span className="font-bold text-red-900 block font-mono text-[9px]">CLOUD:</span>
                  <span className="truncate block">{registeredTeam.domainMap.cloud}</span>
                </div>
                <div className="p-1.5 rounded bg-amber-900/10">
                  <span className="font-bold text-red-900 block font-mono text-[9px]">NETWORKING:</span>
                  <span className="truncate block">{registeredTeam.domainMap.networking}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-center pt-2 border-t border-amber-900/20">
                <button
                  onClick={copyCredentials}
                  className="w-full py-2 rounded-lg bg-black/80 text-white font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "CREDENTIALS COPIED" : "COPY PASS & CREDENTIALS"}</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Bottom Minimal Info */}
      <footer className="arena-footer">
        <span>ABES Engineering College · Ghaziabad</span>
      </footer>
    </div>
  );
}
