"use client";

import React from "react";
import ClubEmblem from "./ClubEmblem";
import { sounds } from "@/lib/sounds";
import { ArrowDown, Flame, Shield, Sparkles } from "lucide-react";

export default function HeroHeader() {
  const scrollToDeck = () => {
    sounds.playLaserZap();
    const el = document.getElementById("registration-deck");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative z-10 pt-20 pb-12 px-4 flex flex-col items-center justify-center text-center">
      {/* Club Presenter Line */}
      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-red-950/40 border border-red-700/40 text-red-400 mb-6 backdrop-blur-sm animate-pulse">
        <ClubEmblem size={20} />
        <span className="font-techno tracking-[0.25em] text-xs uppercase text-red-500 font-bold">
          TECHNOVATION PRESENTS
        </span>
      </div>

      {/* Main Title: CoderLands in Baroque Blackletter */}
      <div className="relative mb-3">
        <h1 className="font-baroque text-6xl sm:text-7xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 tracking-wide drop-shadow-[0_10px_25px_rgba(255,17,58,0.45)] select-none">
          Coderslands
        </h1>
        {/* Subtle red underglow behind title */}
        <div className="absolute inset-0 -z-10 blur-2xl opacity-40 bg-gradient-to-r from-red-600 via-red-500 to-rose-700" />
      </div>

      {/* Interclub Badge */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-600" />
        <span className="font-sheepman text-xl sm:text-2xl tracking-[0.3em] uppercase text-red-500 font-extrabold drop-shadow-[0_0_10px_rgba(255,17,58,0.7)]">
          INTERCLUB ARENA
        </span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-600" />
      </div>

      {/* Event Details & Alice in Borderland Quote */}
      <p className="max-w-2xl text-zinc-300 text-sm sm:text-base leading-relaxed mb-8 px-4 font-body">
        Four Domains. Four Players. One Team Visa. Choose your domain specialists wisely before the laser strikes. Will your club survive the borderland?
      </p>

      {/* Event Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-xs font-mono">
        <div className="px-3.5 py-1.5 rounded-md bg-black/60 border border-zinc-800 text-zinc-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>DATE: 26TH & 27TH</span>
        </div>
        <div className="px-3.5 py-1.5 rounded-md bg-black/60 border border-zinc-800 text-zinc-300 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-red-500" />
          <span>VENUE: SEMINAR HALL 1 (Raman Block)</span>
        </div>
        <div className="px-3.5 py-1.5 rounded-md bg-black/60 border border-zinc-800 text-zinc-300 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>4 PLAYERS PER SQUAD</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={scrollToDeck}
        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white font-sheepman tracking-widest text-lg uppercase shadow-laser hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <span className="relative z-10 flex items-center gap-2">
          CLAIM TEAM VISA
          <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </span>
        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </section>
  );
}
