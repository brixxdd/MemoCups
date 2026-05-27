import { motion } from 'framer-motion';
import { useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../lib/sound';
import { useGameStore } from '../store/gameStore';
import { Button } from './Button';

export function HomeScreen() {
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const startGame = useGameStore((state) => state.startGame);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const [name, setName] = useState('');

  const canPlay = name.trim().length >= 2;

  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-between gap-8 pb-5 pt-5 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Top bar */}
      <div className="flex w-full items-center justify-end">
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

      {/* Hero */}
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
            Sigue el vaso. 10 rondas. ¿Quién llega más lejos?
          </p>
        </div>
      </div>

      {/* Name input + play */}
      <div className="grid w-full max-w-sm gap-3">
        <div className="relative">
          <input
            id="player-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canPlay) {
                sound.unlock();
                sound.play('start');
                startGame(name.trim());
              }
            }}
            placeholder="Tu nombre..."
            maxLength={20}
            className="w-full rounded-[22px] border-2 border-transparent bg-white/80 px-5 py-4 text-center text-lg font-black text-slate-900 shadow-soft outline-none placeholder:font-bold placeholder:text-slate-400 focus:border-sky-300 focus:bg-white transition-all"
          />
        </div>

        <Button
          className="w-full"
          disabled={!canPlay}
          onClick={() => {
            sound.unlock();
            sound.play('start');
            startGame(name.trim());
          }}
        >
          <Play size={22} fill="currentColor" />
          Jugar
        </Button>
      </div>
    </motion.div>
  );
}
