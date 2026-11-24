"use client";

import React from "react";
import { motion } from "framer-motion";
import ClubEmblem from "./ClubEmblem";
import CornerFiligree from "./CornerFiligree";
import { sounds } from "@/lib/sounds";

interface RoyalDirectCardProps {
  rank?: string;
  suit?: string;
  category: string;
  title: string;
  subtitle?: string;
  isFocused?: boolean;
  isSiblingFocused?: boolean;
  baseRotate?: number;
  baseTranslateX?: number;
  baseTranslateY?: number;
  baseScale?: number;
  zIndex?: number;
  onFocusCard?: () => void;
  children?: React.ReactNode;
  footerText?: string;
  className?: string;
  width?: string;
  height?: string;
}

export default function RoyalDirectCard({
  rank = "A",
  suit = "♠",
  category,
  title,
  subtitle,
  isFocused = false,
  isSiblingFocused = false,
  baseRotate = 0,
  baseTranslateX = 0,
  baseTranslateY = 0,
  baseScale = 1,
  zIndex = 10,
  onFocusCard,
  children,
  footerText,
  className = "",
  width = "w-[310px] sm:w-[340px]",
  height = "h-[440px] sm:h-[470px]",
}: RoyalDirectCardProps) {
  const isRed = suit === "♥" || suit === "♦";

  // Dynamic font sizing for long words like CYBERSECURITY so it NEVER cuts off
  const titleFontSize =
    title.length > 11
      ? "text-[21px] sm:text-[23px] tracking-normal"
      : title.length > 8
      ? "text-2xl sm:text-3xl tracking-wide"
      : "text-3xl sm:text-4xl tracking-wider";

  let currentRotate = baseRotate;
  let currentTranslateX = baseTranslateX;
  let currentTranslateY = baseTranslateY;
  let currentScale = baseScale;
  let currentZIndex = zIndex;
  let currentOpacity = 1;

  if (isFocused) {
    // Pan & zoom straight to front center, enlarged and upright!
    currentRotate = 0;
    currentTranslateX = 0;
    currentTranslateY = -22;
    currentScale = baseScale * 1.15;
    currentZIndex = 85;
    currentOpacity = 1;
  } else if (isSiblingFocused) {
    // Sibling recedes back slightly when the other card is focused
    currentRotate = baseRotate * 1.15;
    currentTranslateX = baseTranslateX * 1.25;
    currentTranslateY = baseTranslateY + 18;
    currentScale = baseScale * 0.91;
    currentZIndex = 50;
    currentOpacity = 0.65;
  }

  return (
    <motion.div
      onClick={onFocusCard}
      animate={{
        x: currentTranslateX,
        y: currentTranslateY,
        rotateZ: currentRotate,
        scale: currentScale,
        zIndex: currentZIndex,
        opacity: currentOpacity,
      }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${width} ${height} select-none cursor-pointer transition-shadow pointer-events-auto ${className}`}
    >
      {/* Front Face: Royal Playing Card with Direct Interactive Inputs */}
      <div
        className={`w-full h-full rounded-2xl p-5 sm:p-6 playing-card-parchment foil-glitter flex flex-col justify-between border-2 border-stone-400/60 shadow-2xl transition-all ${
          isFocused
            ? "ring-2 ring-red-700/90 shadow-2xl"
            : isSiblingFocused
            ? "shadow-lg opacity-60"
            : ""
        }`}
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
            <CornerFiligree size={38} position="top-right" />
          </div>
        </div>

        {/* Center Content Area */}
        <div className="my-auto text-center relative z-20 py-1 px-1">
          {/* Gothic Baroque Category Header */}
          <div className="font-baroque text-2xl sm:text-[25px] text-red-800 font-semibold mb-1 drop-shadow-sm whitespace-nowrap">
            {category}
          </div>

          {/* Wood-type Bold Display Title */}
          <h3 className={`font-sheepman ${titleFontSize} text-stone-950 font-black uppercase leading-tight my-1`}>
            {title}
          </h3>

          {subtitle && (
            <div className="font-sheepman text-sm text-stone-700 tracking-wide mb-2">
              {subtitle}
            </div>
          )}

          {/* Direct Input Fields / Content inside the front of the card */}
          {children && (
            <div className="mt-2 text-stone-950 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
          )}
        </div>

        {/* Bottom Row: Bottom-Left Filigree & Bottom-Right Inverted Corner */}
        <div className="flex items-end justify-between border-t border-amber-900/25 pt-2 relative z-20 pointer-events-none">
          <div className="flex flex-col items-start">
            <CornerFiligree size={32} position="bottom-left" />
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
    </motion.div>
  );
}
