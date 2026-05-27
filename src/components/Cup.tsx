import { motion } from 'framer-motion';
import { COLORS, type Round } from '../lib/game';

const cupStyle = 'from-slate-200 to-slate-400 border-white/70';

export function Cup({
  cupId,
  slotIndex,
  round,
  disabled,
  isSelected,
  showToken,
  reveal,
  showWink,
  showTarget,
  targetLabel,
  activeSwap,
  swapMs,
  slotWidth,
  onPick,
}: {
  cupId: number;
  slotIndex: number;
  round: Round;
  disabled: boolean;
  isSelected: boolean;
  showToken: boolean;
  reveal: boolean;
  showWink: boolean;
  showTarget: boolean;
  targetLabel: string;
  activeSwap: { from: number; to: number } | null;
  swapMs: number;
  slotWidth: number;
  onPick: () => void;
}) {
  const isCorrect = cupId === round.correctCup;
  const target = round.mode === 'word' ? round.word : round.ink;
  const hasContent = showToken || reveal;

  // Determine if this cup is involved in the active swap and which role
  const isFrom = activeSwap ? slotIndex === activeSwap.from : false;
  const isTo = activeSwap ? slotIndex === activeSwap.to : false;
  const isActiveSwapCup = isFrom || isTo;

  // 3D crossing effect:
  // "from" cup goes OVER (higher arc, scales up, higher z-index, rotates toward destination)
  // "to"   cup goes UNDER (lower arc, scales down slightly, stays behind)
  const isOverCup = isFrom; // the cup moving "from" passes over
  const isUnderCup = isTo;

  // Direction of travel (+1 = right, -1 = left)
  const travelDir = activeSwap
    ? slotIndex === activeSwap.from
      ? activeSwap.to > activeSwap.from ? 1 : -1
      : activeSwap.from > activeSwap.to ? 1 : -1
    : 0;

  // Horizontal travel distance in pixels (gap between slot centers)
  const dist = activeSwap ? Math.abs(activeSwap.to - activeSwap.from) * slotWidth : 0;
  const xTravel = travelDir * dist;

  // Y arc heights — over cup arcs higher, under cup arcs lower
  const arcPeakOver = -90;
  const arcPeakUnder = -40;

  // Build keyframes: 5 stops [start, lift, peak-cross, descend, land]
  const xFrames = isActiveSwapCup ? [0, xTravel * 0.25, xTravel * 0.5, xTravel * 0.75, xTravel] : undefined;
  const yFrames = isOverCup
    ? [0, arcPeakOver * 0.6, arcPeakOver, arcPeakOver * 0.5, 0]
    : isUnderCup
      ? [0, arcPeakUnder * 0.5, arcPeakUnder, arcPeakUnder * 0.5, 0]
      : undefined;

  // 3D rotation: tilts toward destination, peaks mid-flight, returns
  const rotateYFrames = isOverCup
    ? [0, travelDir * -18, travelDir * -28, travelDir * -18, 0]
    : isUnderCup
      ? [0, travelDir * -8, travelDir * -14, travelDir * -8, 0]
      : undefined;

  const scaleFrames = isOverCup
    ? [1, 1.08, 1.13, 1.08, 1]
    : isUnderCup
      ? [1, 0.94, 0.88, 0.94, 1]
      : undefined;

  const dur = swapMs / 1000;
  const times = [0, 0.2, 0.5, 0.8, 1];

  const swapTransition = {
    duration: dur,
    ease: 'easeInOut' as const,
    times,
  };

  return (
    <motion.button
      aria-label={`Vaso ${cupId + 1}`}
      className="relative grid h-[154px] min-w-0 place-items-center rounded-[26px] transition-transform active:scale-[0.97] disabled:active:scale-100 sm:h-[190px]"
      style={{
        // Over cup renders above under cup at the crossing point
        zIndex: isOverCup ? 20 : isUnderCup ? 1 : 10,
        // Enable perspective for rotateY
        perspective: 600,
      }}
      disabled={disabled}
      onClick={onPick}
      animate={
        isActiveSwapCup
          ? {
              x: xFrames,
              y: yFrames,
              rotateY: rotateYFrames,
              scale: scaleFrames,
            }
          : {
              x: 0,
              y: isSelected ? -14 : 0,
              rotateY: 0,
              scale: 1,
              rotate: isSelected ? (isCorrect ? -4 : 5) : hasContent ? -3.5 : 0,
            }
      }
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      transition={
        isActiveSwapCup
          ? swapTransition
          : { type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }
      }
    >
      {/* Ground shadow — stretches in direction of travel */}
      <motion.div
        className="absolute bottom-2 h-7 w-20 rounded-full bg-slate-900/12 blur-sm sm:w-28"
        animate={{
          scaleX: isSelected ? 0.78 : isOverCup ? 1.3 : isUnderCup ? 0.7 : 1,
          x: isOverCup ? xFrames?.map((v) => v * 0.15) ?? 0 : 0,
          opacity: isUnderCup ? [1, 0.5, 0.4, 0.5, 1] : 1,
        }}
        transition={isActiveSwapCup ? swapTransition : { type: 'spring', stiffness: 220, damping: 18 }}
      />

      {/* Subtle wink: the correct cup sways gently when all cups stop */}
      {showWink && (
        <motion.div
          className="absolute inset-0 rounded-[26px]"
          animate={{ rotate: [-0.8, 0.8, -0.8], y: [0, -2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Token under the cup */}
      <motion.div
        className="absolute bottom-12 z-0 grid h-12 w-16 place-items-center rounded-full bg-white shadow-soft sm:h-14 sm:w-20"
        initial={false}
        animate={{ opacity: hasContent ? 1 : 0, y: hasContent ? 0 : 20, scale: hasContent ? 1 : 0.9, rotate: hasContent ? -6 : 0 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      >
        <span className={`text-xs font-black ${COLORS[target].className}`}>{COLORS[target].label}</span>
      </motion.div>

      {/* "Recuerda" tooltip above cup */}
      <motion.div
        className="absolute -top-16 z-20 grid place-items-center"
        initial={false}
        animate={{ opacity: showTarget ? 1 : 0, y: showTarget ? 0 : 10, scale: showTarget ? 1 : 0.95 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="rounded-full bg-white/92 px-4 py-2 shadow-soft">
          <span className="block text-[0.62rem] font-black uppercase tracking-normal text-slate-400">Recuerda</span>
          <span className={`block text-sm font-black ${COLORS[target].className}`}>{targetLabel}</span>
        </div>
        <div className={`mt-1 h-3 w-3 rotate-45 bg-white/92 shadow-soft`} />
      </motion.div>

      {/* The cup body */}
      <motion.div
        className={`relative z-10 h-28 w-full max-w-[118px] rounded-b-[38px] rounded-t-[18px] border-t-[12px] bg-gradient-to-b ${cupStyle} shadow-[inset_0_-12px_0_rgba(15,23,42,.13),0_11px_0_rgba(15,23,42,.12)] sm:h-36 sm:max-w-[150px]`}
        animate={{
          y: showToken || reveal ? -18 : 0,
          rotate: hasContent ? -3.5 : 0,
        }}
        transition={{ type: 'spring', stiffness: 190, damping: 18, mass: 0.92 }}
      >
        <div className="absolute -top-5 left-1/2 h-10 w-[112%] -translate-x-1/2 rounded-[50%] border-[10px] border-white/75 bg-white/80 text-white/45" />
        <div className="absolute left-[30%] top-10 h-3 w-3 rounded-full bg-slate-900/70" />
        <div className="absolute right-[30%] top-10 h-3 w-3 rounded-full bg-slate-900/70" />
        <div className="absolute left-1/2 top-16 h-2 w-8 -translate-x-1/2 rounded-b-full border-b-4 border-slate-900/70" />
        {isSelected && (
          <motion.div
            className={`absolute -right-2 -top-4 grid h-8 w-8 place-items-center rounded-full text-lg font-black text-white ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {isCorrect ? '!' : 'x'}
          </motion.div>
        )}
      </motion.div>
    </motion.button>
  );
}
