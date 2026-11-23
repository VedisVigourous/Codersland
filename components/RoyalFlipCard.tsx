"use client";

import React from "react";
import { motion } from "framer-motion";
import ClubEmblem from "./ClubEmblem";
import CornerFiligree from "./CornerFiligree";
import { sounds } from "@/lib/sounds";

interface RoyalFlipCardProps {
  rank?: string;
  suit?: string;
  category: string;
  title: string;
  subtitle?: string;
  filledValue?: string;
  isFilled?: boolean;
  isFlipped?: boolean;
  onToggleFlip?: () => void;
  isFocused?: boolean;
  baseRotate?: number;
  baseTranslateX?: number;
  baseTranslateY?: number;
  baseScale?: number;
  zIndex?: number;
  onHover?: () => void;
  childrenBack?: React.ReactNode;
  footerText?: string;
  className?: string;
  width?: string;
  height?: string;
}

export default function RoyalFlipCard({
  rank = "A",
  suit = "♠",
  category,
  title,
  subtitle,
  filledValue,
  isFilled = false,
  isFlipped = false,
  onToggleFlip,
  isFocused = false,
  baseRotate = 0,
  baseTranslateX = 0,
  baseTranslateY = 0,
  baseScale = 1,
  zIndex = 10,
  onHover,
  childrenBack,
  footerText,
  className = "",
  width = "w-[300px] sm:w-[330px]",
  height = "h-[430px] sm:h-[460px]",
}: RoyalFlipCardProps) {
  const isRed = suit === "♥" || suit === "♦";

  // Dynamic font sizing for long words like CYBERSECURITY so it NEVER cuts off
  const titleFontSize =
    title.length > 11
      ? "text-[21px] sm:text-[23px] tracking-normal"
      : title.length > 8
      ? "text-2xl sm:text-3xl tracking-wide"
      : "text-3xl sm:text-4xl tracking-wider";

  const handleCardClick = (e: React.MouseEvent) => {
    // If card is already flipped, clicks inside form inputs should not flip back
    if (isFlipped) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("input")
      ) {
        return;
      }
    }
    if (onToggleFlip) {
      sounds.playCardClick();
      onToggleFlip();
    }
  };

  // When card is flipped to enter details: bring it straight, centered, enlarged, top z-index!
  const currentRotate = isFlipped ? 0 : isFocused ? 0 : baseRotate;
  const currentTranslateX = isFlipped ? 0 : isFocused ? baseTranslateX * 0.4 : baseTranslateX;
  const currentTranslateY = isFlipped ? -25 : isFocused ? baseTranslateY - 18 : baseTranslateY;
  const currentScale = isFlipped ? 1.14 : isFocused ? baseScale * 1.07 : baseScale;
  const currentZIndex = isFlipped ? 100 : isFocused ? 70 : zIndex;

  return (
    <motion.div
      onMouseEnter={onHover}
      onClick={handleCardClick}
      animate={{
        x: currentTranslateX,
        y: currentTranslateY,
        rotateZ: currentRotate,
        scale: currentScale,
        zIndex: currentZIndex,
      }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${width} ${height} cursor-pointer select-none ${className}`}
    >
      {/* 3D Flip Container */}
      <div
        className="w-full h-full relative transition-transform duration-700 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* =============================================================== */}
        {/* FRONT FACE: ROYAL PLAYING CARD (EXACTLY LIKE POSTER)             */}
        {/* =============================================================== */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl p-5 sm:p-6 playing-card-parchment foil-glitter flex flex-col justify-between border-2 border-stone-400/60 shadow-2xl transition-all ${
            isFocused || isFlipped
              ? "ring-2 ring-[#ff113a] shadow-[0_25px_60px_rgba(255,17,58,0.4)]"
              : ""
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Top Row: Corner Indices & Top-Right Filigree */}
          <div className="flex items-start justify-between relative z-20 pointer-events-none">
            {/* Top-Left Corner: Stylized 'N' + Rank */}
            <div className="flex flex-col items-center leading-none">
              <ClubEmblem size={22} />
              <span className="font-sheepman text-2xl font-black text-red-700 mt-1">
                {rank}
              </span>
              <span className={`text-base font-bold ${isRed ? "text-red-700" : "text-stone-900"}`}>
                {suit}
              </span>
            </div>

            {/* Top-Right Corner Filigree */}
            <div className="flex flex-col items-end">
              <CornerFiligree size={38} />
              {childrenBack && (
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-red-800 bg-red-950/10 border border-red-800/30 px-2 py-0.5 rounded-full mt-1 pointer-events-auto">
                  CLICK TO FLIP ↻
                </span>
              )}
            </div>
          </div>

          {/* Center Content Area */}
          <div className="my-auto text-center relative z-20 py-2 px-2 pointer-events-none">
            {/* Gothic Baroque Category Header (Round 1, Domain Specialist, etc.) */}
            <div className="font-baroque text-2xl sm:text-[26px] text-red-800 font-semibold mb-1 drop-shadow-sm whitespace-nowrap">
              {category}
            </div>

            {/* Wood-type Bold Display Title (FOURFOLD, CYBERSECURITY, etc.) */}
            <h3
              className={`font-sheepman ${titleFontSize} text-stone-950 font-black uppercase leading-tight my-1.5`}
            >
              {title}
            </h3>

            {/* Subtitle / Filled Status */}
            {filledValue ? (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-950/15 border border-amber-900/30 pointer-events-auto">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-600 block">
                  REGISTERED:
                </span>
                <span className="font-sheepman text-lg sm:text-xl text-red-900 uppercase block font-bold mt-0.5 truncate">
                  {filledValue}
                </span>
              </div>
            ) : subtitle ? (
              <div className="font-sheepman text-base sm:text-lg text-stone-800 tracking-wide mt-1">
                {subtitle}
              </div>
            ) : childrenBack ? (
              <div className="mt-3 inline-block px-3.5 py-1.5 rounded-full bg-red-900/15 border border-red-800/30 text-red-900 text-[11px] font-mono font-bold tracking-wider animate-pulse pointer-events-auto">
                CLICK ANYWHERE TO ENTER
              </div>
            ) : null}
          </div>

          {/* Bottom Row: Bottom-Left Filigree & Bottom-Right Inverted Corner */}
          <div className="flex items-end justify-between border-t border-amber-900/25 pt-2 relative z-20 pointer-events-none">
            <div className="flex flex-col items-start">
              <CornerFiligree size={32} flip={true} />
              {footerText && (
                <span className="font-mono text-[10px] text-stone-600 mt-1 uppercase font-semibold">
                  {footerText}
                </span>
              )}
            </div>

            <div className="flex flex-col items-center leading-none rotate-180">
              <ClubEmblem size={22} />
              <span className="font-sheepman text-2xl font-black text-red-700 mt-1">
                {rank}
              </span>
              <span className={`text-base font-bold ${isRed ? "text-red-700" : "text-stone-900"}`}>
                {suit}
              </span>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* BACK FACE: CARD REVERSE WITH INTERACTIVE FORM FIELDS            */}
        {/* =============================================================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl p-5 sm:p-6 playing-card-parchment flex flex-col justify-between border-2 border-red-700 shadow-2xl cursor-default"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: isFlipped ? "auto" : "none",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-900/30 pb-2.5">
            <div className="flex items-center gap-2">
              <ClubEmblem size={18} />
              <span className="font-sheepman text-stone-950 text-sm uppercase tracking-wider font-bold">
                {title} // ENTRY
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleFlip}
              className="text-[11px] font-mono text-red-800 hover:text-red-950 font-bold uppercase underline cursor-pointer px-1 py-0.5"
            >
              FLIP BACK ↵
            </button>
          </div>

          {/* Custom Form Content injected into back */}
          <div className="flex-1 flex flex-col justify-center my-2 pointer-events-auto">
            {childrenBack}
          </div>

          {/* Footer Done Button */}
          <div className="border-t border-amber-900/25 pt-2 flex justify-between items-center text-xs font-mono text-stone-600">
            <span className="text-[10px]">TECHNOVATION</span>
            <button
              type="button"
              onClick={onToggleFlip}
              className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-sheepman text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer"
            >
              CONFIRM & FLIP CARD ↵
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
