import { Heart, Pause, Star, Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { sound } from '../lib/sound';
import { MAX_ROUNDS } from '../lib/game';

export function TopBar() {
  const lives = useGameStore((state) => state.lives);
  const score = useGameStore((state) => state.score);
  const roundNumber = useGameStore((state) => state.roundNumber);
  const pause = useGameStore((state) => state.pause);

  return (
    <header className="grid grid-cols-[1fr_auto] gap-3">
      <div className="grid grid-cols-3 gap-2 rounded-[24px] bg-white/75 p-2 shadow-soft backdrop-blur">
        <Stat icon={<Heart size={18} fill="currentColor" />} value={lives} label="Vidas" className="text-rose-500" />
        <Stat icon={<Star size={18} fill="currentColor" />} value={score} label="Puntos" className="text-amber-500" />
        <Stat icon={<Trophy size={18} />} value={`${roundNumber}/${MAX_ROUNDS}`} label="Ronda" className="text-sky-500" />
      </div>
      <button
        aria-label="Pausar"
        className="grid h-full min-h-16 w-16 place-items-center rounded-[22px] bg-white/80 shadow-[0_7px_0_rgba(148,163,184,.45)] transition-transform active:translate-y-1 active:scale-95"
        onClick={() => {
          sound.play('tap');
          pause();
        }}
      >
        <Pause size={24} />
      </button>
    </header>
  );
}

function Stat({ icon, value, label, className }: { icon: React.ReactNode; value: number | string; label: string; className: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center rounded-[18px] bg-white/70 px-1 py-2">
      <div className={`flex items-center gap-1 text-sm font-black ${className}`}>
        {icon}
        <span className="max-w-[4.5rem] truncate">{value}</span>
      </div>
      <span className="text-[0.68rem] font-black uppercase leading-none text-slate-400">{label}</span>
    </div>
  );
}
