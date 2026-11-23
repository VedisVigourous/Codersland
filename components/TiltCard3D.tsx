"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  isFocused?: boolean;
  baseRotate?: number;
  baseScale?: number;
  baseTranslateX?: number;
  baseTranslateY?: number;
  onClick?: () => void;
  onMouseEnter?: () => void;
  zIndex?: number;
}

export default function TiltCard3D({
  children,
  className = "",
  isFocused = false,
  baseRotate = 0,
  baseScale = 1,
  baseTranslateX = 0,
  baseTranslateY = 0,
  onClick,
  onMouseEnter,
  zIndex = 10,
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    setRotateX(-deltaY * 12);
    setRotateY(deltaX * 12);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: isFocused ? baseScale * 1.08 : baseScale,
        rotateZ: isFocused ? 0 : baseRotate,
        x: baseTranslateX,
        y: isFocused ? baseTranslateY - 15 : baseTranslateY,
        zIndex: isFocused ? 60 : zIndex,
        filter: isFocused ? "brightness(1.05)" : "brightness(0.92)",
      }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className={`relative rounded-2xl cursor-pointer select-none transition-shadow ${
        isFocused ? "shadow-[0_30px_70px_rgba(255,17,58,0.45)] ring-2 ring-[#ff113a]" : "shadow-2xl"
      } ${className}`}
    >
      {/* Specular Glare Layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-20"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.7) 0%, rgba(255,17,58,0.2) 35%, transparent 70%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
