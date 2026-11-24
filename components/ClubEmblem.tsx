import React from "react";
import Image from "next/image";

interface ClubEmblemProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function ClubEmblem({ className = "", size = 28, showText = false }: ClubEmblemProps) {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <div 
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.webp"
          alt="Technovation Logo"
          width={size * 2}
          height={size * 2}
          className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,17,58,0.7)]"
          priority
        />
      </div>
      {showText && (
        <span className="font-techno tracking-widest text-xs uppercase text-[#ff113a]">
          Technovation
        </span>
      )}
    </div>
  );
}
