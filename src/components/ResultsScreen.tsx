import { motion } from 'framer-motion';
import { Home, RotateCcw, Trophy, Star } from 'lucide-react';
import { sound } from '../lib/sound';
import { useGameStore } from '../store/gameStore';
import { Button } from './Button';
import { MAX_ROUNDS } from '../lib/game';

export function ResultsScreen() {
  const finalResult = useGameStore((state) => state.finalResult);
  const playerName = useGameStore((state) => state.playerName);
  const startGame = useGameStore((state) => state.startGame);
  const setScreen = useGameStore((state) => state.setScreen);

  const won = finalResult?.won ?? false;
  const score = finalResult?.score ?? 0;
  const round = finalResult?.round ?? 0;
  const accuracy = finalResult?.accuracy ?? 0;

  return (
    <motion.div
      className="grid flex-1 place-items-center py-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="grid w-full max-w-md gap-5 rounded-[32px] bg-white/82 p-6 text-center shadow-pop backdrop-blur">
        {/* Icon */}
        <motion.div
          className={`mx-auto grid h-20 w-20 place-items-center rounded-[26px] text-white shadow-[0_8px_0] ${
            won
              ? 'bg-amber-400 shadow-amber-500/70'
              : 'bg-slate-700 shadow-slate-800/60'
          }`}
          animate={won ? { rotate: [-4, 4, -4], scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {won ? <Trophy size={40} fill="currentColor" /> : <Star size={40} />}
        </motion.div>

        {/* Name + result */}
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-slate-400">
            {won ? '¡Completaste todas las rondas!' : 'Se acabaron las vidas'}
          </p>
          <h2 className="mt-1 text-4xl font-black text-slate-900">
            {playerName || 'Jugador'}
          </h2>
        </div>

        {/* Score — big and central */}
        <motion.div
          className={`rounded-[24px] py-5 ${won ? 'bg-amber-50' : 'bg-slate-50'}`}
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-sm font-black uppercase tracking-widest text-slate-400">Puntuación</p>
          <p className={`text-6xl font-black ${won ? 'text-amber-500' : 'text-slate-800'}`}>
            {score.toLocaleString()}
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="Rondas" value={`${round} / ${MAX_ROUNDS}`} />
          <StatBox label="Precisión" value={`${accuracy}%`} />
        </div>

        {/* Actions */}
        <div className="grid gap-3">
          <Button
            onClick={() => {
              sound.play('start');
              startGame(playerName);
            }}
          >
            <RotateCcw size={21} />
            Jugar de nuevo
          </Button>
          <Button
            tone="ghost"
            onClick={() => {
              sound.play('tap');
              setScreen('home');
            }}
          >
            <Home size={21} />
            Cambiar jugador
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-slate-100/80 px-3 py-3">
      <div className="text-xl font-black text-slate-900">{value}</div>
      <div className="text-[0.68rem] font-black uppercase text-slate-400">{label}</div>
    </div>
  );
}
