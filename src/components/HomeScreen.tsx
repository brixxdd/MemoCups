import { motion } from 'framer-motion';
import { Play, Trophy, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../lib/sound';
import { useGameStore } from '../store/gameStore';
import { Button } from './Button';

export function HomeScreen() {
  const highScore = useGameStore((state) => state.highScore);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const startGame = useGameStore((state) => state.startGame);
  const toggleSound = useGameStore((state) => state.toggleSound);

  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-between gap-8 pb-5 pt-5 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 font-black shadow-soft">
          <Trophy size={20} className="text-amber-500" />
          {highScore}
        </div>
        <button
          aria-label="Alternar sonido"
          className="grid h-12 w-12 place-items-center rounded-full bg-white/75 shadow-soft transition-transform active:scale-95"
          onClick={() => {
            toggleSound();
            sound.play('tap');
          }}
        >
          {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
        </button>
      </div>

      <div className="grid place-items-center gap-6">
        <motion.div
          className="relative h-44 w-44"
          animate={{ rotate: [0, -3, 3, 0], y: [0, -4, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-x-8 bottom-3 h-16 rounded-full bg-slate-900/10 blur-sm" />
          <div className="absolute bottom-8 left-6 h-24 w-32 rounded-b-[42px] rounded-t-[18px] bg-gradient-to-b from-sky-300 to-sky-500 shadow-[inset_0_-10px_0_rgba(2,132,199,.28),0_14px_0_rgba(2,132,199,.25)]" />
          <div className="absolute bottom-[118px] left-4 h-10 w-36 rounded-[50%] border-[10px] border-sky-200 bg-sky-100" />
          <div className="absolute left-14 top-2 h-16 w-16 rounded-full bg-amber-200 shadow-[inset_0_-6px_0_rgba(251,191,36,.45)]" />
          <div className="absolute left-[72px] top-8 flex gap-4">
            <span className="h-2 w-2 rounded-full bg-slate-800" />
            <span className="h-2 w-2 rounded-full bg-slate-800" />
          </div>
          <div className="absolute left-[78px] top-14 h-2 w-7 rounded-b-full border-b-4 border-slate-800" />
        </motion.div>

        <div>
          <h1 className="text-5xl font-black tracking-normal text-slate-900 sm:text-6xl">MemoCups</h1>
          <p className="mx-auto mt-3 max-w-sm text-lg font-bold leading-snug text-slate-600">
            Recuerda lo que importa antes de que los vasos te confundan.
          </p>
        </div>
      </div>

      <div className="grid w-full max-w-sm gap-3">
        <Button
          className="w-full"
          onClick={() => {
            sound.unlock();
            sound.play('start');
            startGame();
          }}
        >
          <Play size={22} fill="currentColor" />
          Jugar
        </Button>
        <Button tone="ghost" className="w-full" onClick={() => useGameStore.getState().setScreen('results')}>
          <Trophy size={20} />
          Resultados
        </Button>
      </div>
    </motion.div>
  );
}
