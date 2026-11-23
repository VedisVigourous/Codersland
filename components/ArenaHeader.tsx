import { Volume2, VolumeX } from "lucide-react";
import ClubEmblem from "./ClubEmblem";

export function SoundToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  const Icon = enabled ? Volume2 : VolumeX;

  return (
    <button type="button" className="arena-control" aria-label="Sound" aria-pressed={enabled} onClick={onToggle}>
      <Icon size={16} aria-hidden="true" />
      <span>Sound {enabled ? "on" : "off"}</span>
    </button>
  );
}

interface ArenaHeaderProps {
  audioEnabled: boolean;
  toggleSound: () => void;
  onOpenOrganizer: () => void;
  children?: React.ReactNode;
}

export default function ArenaHeader({ audioEnabled, toggleSound, onOpenOrganizer, children }: ArenaHeaderProps) {
  return (
    <header className="arena-header">
      <div className="arena-brand">
        <ClubEmblem size={22} />
        <span>Technovation</span>
      </div>
      {children}
      <div className="arena-controls">
        <SoundToggle enabled={audioEnabled} onToggle={toggleSound} />
        <button type="button" onClick={onOpenOrganizer} className="arena-control">
          Organizer
        </button>
      </div>
    </header>
  );
}
