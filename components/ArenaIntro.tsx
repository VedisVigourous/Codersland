import { CalendarDays, MapPin, UsersRound } from "lucide-react";

export default function ArenaIntro({ onRegister, onBriefing }: { onRegister: () => void; onBriefing: () => void }) {
  return (
    <div className="arena-intro">
      <div className="arena-intro-copy">
        <p className="arena-kicker">Interclub technical competition</p>
        <h1 className="font-baroque">CoderLands</h1>
        <div className="arena-suits" aria-hidden="true">
          <span>♠︎</span>
          <span>♦︎</span>
          <span>♣︎</span>
          <span>♥︎</span>
        </div>
        <p className="arena-hook">How far can you go?</p>
        <p className="arena-description">
          Four specialists. Two rounds. Make your next move count.
        </p>
        <div className="arena-intro-actions">
          <button type="button" className="arena-action" onClick={onRegister}>Start registration</button>
          <button type="button" className="arena-text-action" onClick={onBriefing}>Event briefing</button>
        </div>
      </div>
      <ul className="arena-event-facts">
        <li><CalendarDays size={18} aria-hidden="true" /><span>26–27 November 2026</span></li>
        <li><MapPin size={18} aria-hidden="true" /><span>Seminar Hall 1, Raman Block<small>ABES Engineering College</small></span></li>
        <li><UsersRound size={18} aria-hidden="true" /><span>Teams of four</span></li>
      </ul>
    </div>
  );
}
