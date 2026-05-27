import { motion } from 'framer-motion';
import { Home, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../lib/sound';
import { useGameStore } from '../store/gameStore';
import { Button } from './Button';

export function OverlayScreen({ type }: { type: 'pause' | 'gameOver' }) {
  const resume = useGameStore((state) => state.resume);
  const restart = useGameStore((state) => state.restart);
  const setScreen = useGameStore((state) => state.setScreen);
  const score = useGameStore((state) => state.score);
  const roundNumber = useGameStore((state) => state.roundNumber);
  const highScore = useGameStore((state) => state.highScore);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const isPause = type === 'pause';

  return (
    <motion.div
      className="grid flex-1 place-items-center py-5"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="grid w-full max-w-md gap-5 rounded-[32px] bg-white/82 p-5 text-center shadow-pop backdrop-blur">
        <div className="grid gap-2">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-amber-200 text-3xl shadow-[0_7px_0_#f59e0b]">
            {isPause ? 'II' : '!'}
          </span>
          <h2 className="text-4xl font-black text-slate-900">{isPause ? 'Pausa' : 'Game Over'}</h2>
          <p className="font-bold text-slate-500">
            {isPause ? 'Tu ronda queda lista para continuar.' : `Llegaste a la ronda ${roundNumber}.`}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Metric label="Puntos" value={score} />
          <Metric label="Ronda" value={roundNumber} />
          <Metric label="Record" value={highScore} />
        </div>

        <div className="grid gap-3">
          {isPause ? (
            <Button
              onClick={() => {
                sound.play('tap');
                resume();
              }}
            >
              <Play size={21} fill="currentColor" />
              Continuar
            </Button>
          ) : (
            <Button
              onClick={() => {
                sound.play('start');
                restart();
              }}
            >
              <RotateCcw size={21} />
              Nueva partida
            </Button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button tone="ghost" className="px-2" onClick={() => {
              sound.play('tap');
              setScreen('home');
            }} aria-label="Inicio">
              <Home size={21} />
            </Button>
            <Button
              tone="ghost"
              className="px-2"
              onClick={() => {
                toggleSound();
                sound.play('tap');
              }}
              aria-label="Sonido"
            >
              {soundEnabled ? <Volume2 size={21} /> : <VolumeX size={21} />}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[20px] bg-slate-100/80 px-2 py-3">
      <div className="truncate text-xl font-black text-slate-900">{value}</div>
      <div className="text-[0.66rem] font-black uppercase text-slate-400">{label}</div>
    </div>
  );
}
