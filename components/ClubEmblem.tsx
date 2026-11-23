import React from "react";

interface ClubEmblemProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function ClubEmblem({ className = "", size = 28, showText = false }: ClubEmblemProps) {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Technovation 'N' Stylized Logo */}
      <div 
        className="relative flex items-center justify-center font-black tracking-tighter"
        style={{ width: size, height: size }}
      >
        <svg 
          viewBox="0 0 100 100" 
          width={size} 
          height={size} 
          className="fill-current text-[#ff113a] drop-shadow-[0_0_8px_rgba(255,17,58,0.7)]"
        >
          <g transform="translate(100 0) scale(-1 1)">
            {/* Stylized sharp geometric Technovation 'N' */}
            <path d="M 18 10 L 38 10 L 38 48 L 62 10 L 82 10 L 82 90 L 62 90 L 62 52 L 38 90 L 18 90 Z" />
            <polygon points="10,10 16,10 10,16" className="fill-red-700" />
            <polygon points="84,84 90,84 90,90" className="fill-red-700" />
          </g>
        </svg>
      </div>
      {showText && (
        <span className="font-techno tracking-widest text-xs uppercase text-[#ff113a]">
          Technovation
        </span>
      )}
    </div>
  );
}
