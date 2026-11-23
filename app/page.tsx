import BorderlandArena from "@/components/BorderlandArena";
import ContinuousScrollStage from "@/components/ContinuousScrollStage";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050508] text-zinc-100">
      {/* 1. Atmospheric 3D Borderland Arena (Red Lasers, Ambient Shoji Grid) */}
      <BorderlandArena />

      {/* 2. The Continuous Scroll 3D Experience (Unified top bar, physical card migration to edges, 3D card flips) */}
      <ContinuousScrollStage />
    </main>
  );
}
