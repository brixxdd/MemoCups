import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { applyMove, getDifficulty, getRoundTarget } from '../lib/game';
import { sound } from '../lib/sound';
import { useGameStore } from '../store/gameStore';
import { ColorPrompt } from './ColorPrompt';
import { Cup } from './Cup';
import { TopBar } from './TopBar';

export function GameScreen() {
  const round = useGameStore((state) => state.round);
  const phase = useGameStore((state) => state.phase);
  const roundNumber = useGameStore((state) => state.roundNumber);
  const selectedCup = useGameStore((state) => state.selectedCup);
  const lastCorrect = useGameStore((state) => state.lastCorrect);
  const setPhase = useGameStore((state) => state.setPhase);
  const setCupOrder = useGameStore((state) => state.setCupOrder);
  const chooseCup = useGameStore((state) => state.chooseCup);
  const continueAfterResult = useGameStore((state) => state.continueAfterResult);
  const timers = useRef<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [slotWidth, setSlotWidth] = useState(0);
  const [activeSwap, setActiveSwap] = useState<{ from: number; to: number } | null>(null);
  const difficulty = useMemo(() => getDifficulty(roundNumber), [roundNumber]);
  const roundId = round?.id;

  // Measure slot width whenever the container resizes
  const measureSlots = useCallback(() => {
    if (containerRef.current) {
      setSlotWidth(containerRef.current.offsetWidth / 3);
    }
  }, []);

  useEffect(() => {
    measureSlots();
    const ro = new ResizeObserver(measureSlots);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measureSlots]);

  useEffect(() => {
    if (!round) return;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setActiveSwap(null);

    if (phase === 'memorize') {
      timers.current.push(window.setTimeout(() => setPhase('hide'), difficulty.memorizeMs));
    }

    if (phase === 'hide') {
      timers.current.push(window.setTimeout(() => setPhase('shuffle'), 520));
    }

    if (phase === 'shuffle') {
      let order = [...round.cupOrder];
      const moves = [...round.shuffleMoves];

      moves.forEach((move, index) => {
        timers.current.push(
          window.setTimeout(() => {
            setActiveSwap({ from: move[0], to: move[1] });
            // Reorder DOM at arc peak (50%) so layout animates horizontally through the top of the arc
            timers.current.push(window.setTimeout(() => {
              order = applyMove(order, move);
              setCupOrder(order);
            }, difficulty.swapMs * 0.5));
            // Clear activeSwap near the end (90%) so the cup settles naturally
            timers.current.push(window.setTimeout(() => setActiveSwap(null), difficulty.swapMs * 0.9));
            sound.play('shuffle');
            if (index === moves.length - 1) {
              timers.current.push(window.setTimeout(() => setPhase('guess'), difficulty.swapMs + 120));
            }
          }, index * difficulty.swapMs),
        );
      });
    }

    return () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      setActiveSwap(null);
    };
  }, [phase, roundId, difficulty.memorizeMs, difficulty.swapMs, setCupOrder, setPhase]);

  if (!round) return null;

  const canPick = phase === 'guess';
  const showToken = phase === 'memorize' || phase === 'hide';
  const reveal = phase === 'result';
  const target = getRoundTarget(round);

  return (
    <motion.div
      className="flex flex-1 flex-col gap-4 pb-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
    >
      <TopBar />

      <ColorPrompt round={round} show={phase === 'memorize'} />

      {phase === 'memorize' && (
        <motion.div
          className="mx-auto -mt-1 rounded-full bg-slate-900/75 px-4 py-2 text-sm font-black text-white shadow-soft"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          Todos los vasos se ven igual. Sigue el marcado
        </motion.div>
      )}

      <div className="relative flex flex-1 items-end justify-center">
        <div className="absolute bottom-0 h-20 w-full max-w-2xl rounded-[50%] bg-emerald-300/25 blur-sm" />
        <motion.div ref={containerRef} className="relative grid w-full max-w-2xl grid-cols-3 items-end gap-2 sm:gap-5">
          {round.cupOrder.map((cupId, slotIndex) => (
            <Cup
              key={cupId}
              cupId={cupId}
              slotIndex={slotIndex}
              round={round}
              disabled={!canPick}
              isSelected={selectedCup === cupId}
              showToken={showToken && cupId === round.correctCup}
              reveal={reveal && cupId === round.correctCup}
              showWink={phase === 'guess' && cupId === round.correctCup}
              showTarget={phase === 'memorize' && cupId === round.correctCup}
              targetLabel={target.label}
              activeSwap={activeSwap}
              swapMs={difficulty.swapMs}
              slotWidth={slotWidth}
              onPick={() => {
                sound.play('tap');
                const isCorrect = cupId === round.correctCup;
                sound.play(isCorrect ? 'success' : 'fail');
                chooseCup(cupId, isCorrect);
              }}
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {phase === 'result' && (
          <motion.div
            className="mx-auto grid w-full max-w-sm gap-3 rounded-[28px] bg-white/80 p-4 text-center shadow-soft backdrop-blur"
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <strong className={`text-2xl font-black ${lastCorrect ? 'text-emerald-600' : 'text-rose-500'}`}>
              {lastCorrect ? 'Correcto' : 'Casi'}
            </strong>
            <button
              className="min-h-14 rounded-[22px] bg-slate-900 px-5 py-3 font-black text-white shadow-[0_8px_0_rgba(15,23,42,.28)] transition-transform active:translate-y-1 active:scale-[0.98]"
              onClick={() => {
                sound.play('tap');
                continueAfterResult();
              }}
            >
              {lastCorrect ? 'Siguiente ronda' : 'Intentar de nuevo'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
