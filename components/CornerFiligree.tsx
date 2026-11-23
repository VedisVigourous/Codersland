import React from "react";

interface CornerFiligreeProps {
  className?: string;
  size?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  flip?: boolean;
}

export default function CornerFiligree({
  className = "",
  size = 32,
  position,
  flip = false,
}: CornerFiligreeProps) {
  let transformClass = "";

  if (position === "top-right") {
    transformClass = "-scale-x-100";
  } else if (position === "bottom-left") {
    transformClass = "-scale-y-100";
  } else if (position === "bottom-right" || flip) {
    transformClass = "rotate-180";
  }

  return (
    <svg
      viewBox="0 0 50 50"
      width={size}
      height={size}
      className={`fill-none stroke-current text-red-900/60 ${transformClass} ${className}`}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Ornate Royal Corner Flourish matching the poster cards */}
      <path d="M 2 48 L 2 12 C 2 6, 6 2, 12 2 L 48 2" />
      <path d="M 8 48 L 8 16 C 8 11, 11 8, 16 8 L 48 8" strokeWidth="0.8" />
      {/* Floral / Diamond Petal Accent in corner */}
      <circle cx="16" cy="16" r="2.5" className="fill-red-800/70" />
      <path d="M 16 9 L 16 23 M 9 16 L 23 16" strokeWidth="0.8" />
      <path d="M 12 12 L 20 20 M 12 20 L 20 12" strokeWidth="0.8" />
      <circle cx="28" cy="8" r="1.5" className="fill-red-800/50" />
      <circle cx="8" cy="28" r="1.5" className="fill-red-800/50" />
    </svg>
  );
}
