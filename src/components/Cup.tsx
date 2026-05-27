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
  showContentMarker,
  showTarget,
  targetLabel,
  activeSwap,
  swapMs,
  onPick,
}: {
  cupId: number;
  slotIndex: number;
  round: Round;
  disabled: boolean;
  isSelected: boolean;
  showToken: boolean;
  reveal: boolean;
  showContentMarker: boolean;
  showTarget: boolean;
  targetLabel: string;
  activeSwap: { from: number; to: number } | null;
  swapMs: number;
  onPick: () => void;
}) {
  const isCorrect = cupId === round.correctCup;
  const target = round.mode === 'word' ? round.word : round.ink;
  const isActiveSwapCup = activeSwap ? slotIndex === activeSwap.from || slotIndex === activeSwap.to : false;
  const swapDirection = activeSwap ? (slotIndex === activeSwap.from ? (activeSwap.to > activeSwap.from ? 1 : -1) : activeSwap.from > activeSwap.to ? 1 : -1) : 0;
  const hasContent = showToken || reveal;

  // Arc trajectory: keyframes trace a parabola, duration synced with swapMs
  const arcDuration = swapMs / 1000;
  const arcY = isActiveSwapCup ? [0, -72, -88, -72, 0] : isSelected ? -14 : 0;
  const arcRotate = isActiveSwapCup
    ? [0, swapDirection * 10, swapDirection * 16, swapDirection * 10, 0]
    : isSelected
      ? (isCorrect ? -4 : 5)
      : hasContent ? -3.5 : 0;

  return (
    <motion.button
      layout
      aria-label={`Vaso ${cupId + 1}`}
      className="relative grid h-[154px] min-w-0 place-items-center rounded-[26px] transition-transform active:scale-[0.97] disabled:active:scale-100 sm:h-[190px]"
      disabled={disabled}
      onClick={onPick}
      animate={{
        y: arcY,
        scale: isActiveSwapCup ? [1, 1.06, 1.1, 1.06, 1] : 1,
        rotate: arcRotate,
      }}
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      transition={
        isActiveSwapCup
          ? { duration: arcDuration, ease: [0.45, 0, 0.55, 1], times: [0, 0.2, 0.5, 0.8, 1] }
          : { type: 'spring', stiffness: 220, damping: 18, mass: 0.9 }
      }
    >
      <motion.div
        className="absolute bottom-2 h-7 w-20 rounded-full bg-slate-900/12 blur-sm sm:w-28"
        animate={{ scaleX: isSelected ? 0.78 : isActiveSwapCup ? 0.8 : 1 }}
      />

      <motion.div
        className="absolute -top-8 z-30 grid h-7 w-7 place-items-center rounded-full bg-white shadow-soft sm:-top-9 sm:h-8 sm:w-8"
        initial={false}
        animate={{
          opacity: showContentMarker ? 1 : 0,
          y: showContentMarker ? -2 : 8,
          scale: showContentMarker ? [1, 1.08, 1] : 0.85,
          rotate: showContentMarker ? [-4, 4, -4] : 0,
        }}
        transition={{
          duration: showContentMarker ? 0.95 : 0.18,
          repeat: showContentMarker ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <div className={`h-3.5 w-3.5 rounded-full ${COLORS[target].className.replace('text-', 'bg-')}`} />
      </motion.div>

      <motion.div
        className="absolute bottom-12 z-0 grid h-12 w-16 place-items-center rounded-full bg-white shadow-soft sm:h-14 sm:w-20"
        initial={false}
        animate={{ opacity: hasContent ? 1 : 0, y: hasContent ? 0 : 20, scale: hasContent ? 1 : 0.9, rotate: hasContent ? -6 : 0 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      >
        <span className={`text-xs font-black ${COLORS[target].className}`}>{COLORS[target].label}</span>
      </motion.div>

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
