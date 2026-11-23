"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, useScroll, useTransform } from "framer-motion";
import ClubEmblem from "./ClubEmblem";
import { ChevronLeft, ChevronRight, Sparkles, Flame, Shield, Globe, Cpu, Server, Network } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface EventCardData {
  id: string;
  suit: "♠" | "♥" | "♣" | "♦";
  rank: "A" | "K" | "Q" | "J";
  category: string;
  title: string;
  subtitle: string;
  dateOrInfo: string;
  badge: string;
  details: string[];
  themeColor: string;
}

const CARDS_DATA: EventCardData[] = [
  {
    id: "round-1",
    suit: "♠",
    rank: "A",
    category: "Round 1",
    title: "FOURFOLD",
    subtitle: "Domain Conquest",
    dateOrInfo: "26th - 27th",
    badge: "15 Qs Per Domain",
    details: [
      "1 Domain Active At A Time",
      "15 Locked Questions Each",
      "Assigned Domain Specialists Only",
      "Speed & Accuracy Scoring",
    ],
    themeColor: "text-zinc-900",
  },
  {
    id: "domains",
    suit: "♦",
    rank: "A",
    category: "Specializations",
    title: "THE 4 REALMS",
    subtitle: "Distribute Your Roster",
    dateOrInfo: "Mandatory Allocation",
    badge: "4 Squad Members",
    details: [
      "🌐 Web Development (Frontier)",
      "🛡️ Cybersecurity (Breach Defense)",
      "☁️ Cloud Computing (Infra Scale)",
      "🔗 Networking (Protocol Mastery)",
    ],
    themeColor: "text-red-700",
  },
  {
    id: "round-2",
    suit: "♥",
    rank: "A",
    category: "Round 2",
    title: "GAMBiT",
    subtitle: "The Mastermind Phase",
    dateOrInfo: "Final Stage",
    badge: "High Stakes",
    details: [
      "Top Qualifying Clubs Clash",
      "Multi-Domain Strategic Problem",
      "Real-time Arena Leaderboard",
      "Borderland Trophies & Visas",
    ],
    themeColor: "text-red-700",
  },
  {
    id: "logistics",
    suit: "♣",
    rank: "A",
    category: "Logistics",
    title: "SEMINAR HALL 1",
    subtitle: "Raman Block Arena",
    dateOrInfo: "Report 09:00 AM",
    badge: "Physical Attendance",
    details: [
      "Bring 1 Laptop Per Member",
      "Live Network Terminals Active",
      "Official Technovation Visa Check",
      "Zero Unauthorized Devices Allowed",
    ],
    themeColor: "text-zinc-900",
  },
];

export default function EventCardCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({ delay: 3500, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Scroll scatter effect
  const { scrollYProgress } = useScroll();
  const scatterLeftX = useTransform(scrollYProgress, [0.05, 0.3], [0, -320]);
  const scatterRightX = useTransform(scrollYProgress, [0.05, 0.3], [0, 320]);
  const scatterRotate = useTransform(scrollYProgress, [0.05, 0.3], [0, 25]);
  const scatterOpacity = useTransform(scrollYProgress, [0.2, 0.35], [1, 0.4]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = () => {
    if (emblaApi) {
      sounds.playCardSwoosh();
      emblaApi.scrollPrev();
    }
  };

  const scrollNext = () => {
    if (emblaApi) {
      sounds.playCardSwoosh();
      emblaApi.scrollNext();
    }
  };

  return (
    <section className="relative z-10 py-12 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-500 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DECK OF PROTOCOLS</span>
        </div>
        <h2 className="font-sheepman text-3xl sm:text-4xl text-zinc-100 tracking-wider uppercase">
          EVENT BRIEFING CARDS
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm font-body mt-1">
          Swipe through the tournament dossiers • Cards scatter on scroll as you descend into registration
        </p>
      </div>

      {/* Embla Carousel Container */}
      <motion.div
        style={{ opacity: scatterOpacity }}
        className="relative overflow-hidden py-6"
      >
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-4">
            {CARDS_DATA.map((card, idx) => {
              const isRedSuit = card.suit === "♥" || card.suit === "♦";
              return (
                <div
                  key={card.id}
                  className="flex-[0_0_88%] sm:flex-[0_0_55%] md:flex-[0_0_42%] lg:flex-[0_0_35%] pl-4"
                >
                  <motion.div
                    style={{
                      x: idx % 2 === 0 ? scatterLeftX : scatterRightX,
                      rotate: idx % 2 === 0 ? -scatterRotate : scatterRotate,
                    }}
                    whileHover={{ scale: 1.03, y: -6 }}
                    className="relative rounded-2xl p-6 sm:p-7 playing-card-parchment foil-glitter transition-all duration-300 min-h-[440px] flex flex-col justify-between select-none"
                  >
                    {/* Corner Indices (Top Left) */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col items-center leading-none">
                        <span className="font-sheepman text-2xl font-black text-red-700">
                          {card.rank}
                        </span>
                        <span className={`text-xl font-bold ${isRedSuit ? "text-red-700" : "text-zinc-900"}`}>
                          {card.suit}
                        </span>
                        <div className="mt-1">
                          <ClubEmblem size={18} />
                        </div>
                      </div>

                      {/* Top Right Filigree & Category */}
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-950/15 border border-red-800/30 text-red-800 font-mono text-[10px] uppercase font-bold tracking-wider">
                          {card.badge}
                        </span>
                        <div className="text-stone-400 text-xs mt-1">
                          {isRedSuit ? "♦" : "♠"} {isRedSuit ? "♥" : "♣"}
                        </div>
                      </div>
                    </div>

                    {/* Center Card Content */}
                    <div className="my-auto py-4 text-center">
                      <div className="font-baroque text-2xl sm:text-3xl text-red-800 font-semibold mb-1 drop-shadow-sm">
                        {card.category}
                      </div>
                      <div className="font-sheepman text-3xl sm:text-4xl text-zinc-950 font-black tracking-wider uppercase mb-1">
                        {card.title}
                      </div>
                      <div className="font-mono text-xs text-red-900 font-bold uppercase tracking-widest mb-4">
                        {card.subtitle}
                      </div>

                      {/* Detail points */}
                      <div className="bg-amber-950/10 rounded-xl p-3.5 border border-amber-900/20 text-left space-y-1.5 font-body">
                        {card.details.map((d, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2 text-xs text-stone-800 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-700" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Index (Inverted) */}
                    <div className="flex items-end justify-between pt-2 border-t border-amber-900/20">
                      <span className="font-mono text-xs font-bold text-red-800">
                        {card.dateOrInfo}
                      </span>
                      <div className="flex flex-col items-center leading-none rotate-180">
                        <span className="font-sheepman text-2xl font-black text-red-700">
                          {card.rank}
                        </span>
                        <span className={`text-xl font-bold ${isRedSuit ? "text-red-700" : "text-zinc-900"}`}>
                          {card.suit}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 border border-red-800/60 text-red-400 hover:text-white hover:bg-red-900/60 flex items-center justify-center backdrop-blur-md transition-all shadow-lg z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 border border-red-800/60 text-red-400 hover:text-white hover:bg-red-900/60 flex items-center justify-center backdrop-blur-md transition-all shadow-lg z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </motion.div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {CARDS_DATA.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi && emblaApi.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              selectedIndex === i ? "w-8 bg-red-500 shadow-[0_0_8px_#ff113a]" : "w-2 bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
