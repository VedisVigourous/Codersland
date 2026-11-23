import BorderlandArena from "@/components/BorderlandArena";
import ContinuousScrollStage from "@/components/ContinuousScrollStage";

export default function Home() {
  return (
    <main className="arena-page relative min-h-screen">
      <BorderlandArena />

      <ContinuousScrollStage />
    </main>
  );
}
