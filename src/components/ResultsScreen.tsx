import { motion } from 'framer-motion';
import { Home, RotateCcw, Trophy } from 'lucide-react';
import { sound } from '../lib/sound';
import { useGameStore } from '../store/gameStore';
import { Button } from './Button';

export function ResultsScreen() {
  const finalResult = useGameStore((state) => state.finalResult);
  const highScore = useGameStore((state) => state.highScore);
  const startGame = useGameStore((state) => state.startGame);
  const setScreen = useGameStore((state) => state.setScreen);

  return (
    <motion.div
      className="grid flex-1 place-items-center py-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="grid w-full max-w-md gap-5 rounded-[32px] bg-white/82 p-5 text-center shadow-pop backdrop-blur">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-[26px] bg-amber-300 text-amber-900 shadow-[0_8px_0_#f59e0b]">
          <Trophy size={42} fill="currentColor" />
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-900">Resultados</h2>
          <p className="mt-1 font-bold text-slate-500">Tu mejor marca queda guardada en este dispositivo.</p>
        </div>

        <div className="grid gap-2">
          <ScoreRow label="High score" value={highScore} strong />
          <ScoreRow label="Ultima partida" value={finalResult?.score ?? 0} />
          <ScoreRow label="Ronda alcanzada" value={finalResult?.round ?? 0} />
          <ScoreRow label="Precision" value={`${finalResult?.accuracy ?? 0}%`} />
        </div>

        <div className="grid gap-3">
          <Button
            onClick={() => {
              sound.play('start');
              startGame();
            }}
          >
            <RotateCcw size={21} />
            Jugar otra vez
          </Button>
          <Button
            tone="ghost"
            onClick={() => {
              sound.play('tap');
              setScreen('home');
            }}
          >
            <Home size={21} />
            Inicio
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ScoreRow({ label, value, strong = false }: { label: string; value: number | string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-[20px] px-4 py-3 ${strong ? 'bg-amber-100' : 'bg-slate-100/80'}`}>
      <span className="font-black text-slate-500">{label}</span>
      <span className="text-xl font-black text-slate-900">{value}</span>
    </div>
  );
}
