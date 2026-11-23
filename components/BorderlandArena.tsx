"use client";

import React, { useState, useEffect } from "react";

export default function BorderlandArena() {
  const [lasers, setLasers] = useState<number[]>([]);

  useEffect(() => {
    setLasers([8, 22, 35, 65, 78, 92]);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Deep Arena Gradient & Ambient Dystopian Glow */}
      <div className="absolute inset-0 bg-borderland-arena" />

      {/* 2. Red Laser Beams (Alice in Borderland signature) */}
      {lasers.map((pos, idx) => (
        <div
          key={idx}
          className="laser-beam animate-laserPulse"
          style={{
            left: `${pos}%`,
            animationDelay: `${idx * 0.4}s`,
            opacity: 0.6 + (idx % 3) * 0.15,
          }}
        />
      ))}

      {/* 3. Shoji Screen Shadow Silhouettes & Red Gate Light (Top Backdrop) */}
      <div className="absolute top-0 left-0 right-0 h-96 opacity-35 bg-[radial-gradient(ellipse_at_top,#ff003344_0%,transparent_70%)]" />

      {/* 4. Checkerboard Floor Perspective Grid (Bottom) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 opacity-20"
        style={{
          background: `
            linear-gradient(to top, rgba(5,5,8,1) 0%, transparent 100%),
            perspective(400px) rotateX(60deg)
          `,
          backgroundImage: `
            repeating-linear-gradient(45deg, #ff113a11 25%, transparent 25%, transparent 75%, #ff113a11 75%, #ff113a11),
            repeating-linear-gradient(45deg, #ff113a11 25%, #050508 25%, #050508 75%, #ff113a11 75%, #ff113a11)
          `,
          backgroundPosition: "0 0, 20px 20px",
          backgroundSize: "40px 40px",
        }}
      />

      {/* 5. Floating Card Suit Watermarks */}
      <div className="absolute top-1/4 left-10 text-9xl text-red-900/10 font-serif rotate-12">
        ♠
      </div>
      <div className="absolute top-1/3 right-12 text-9xl text-red-900/10 font-serif -rotate-12">
        ♥
      </div>
      <div className="absolute bottom-1/4 left-16 text-9xl text-red-900/10 font-serif -rotate-6">
        ♣
      </div>
      <div className="absolute bottom-1/3 right-20 text-9xl text-red-900/10 font-serif rotate-6">
        ♦
      </div>
    </div>
  );
}
