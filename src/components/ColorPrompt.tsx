import { AnimatePresence, motion } from 'framer-motion';
import { COLORS, type Round } from '../lib/game';

export function ColorPrompt({ round, show }: { round: Round; show: boolean }) {
  const targetText = round.mode === 'word' ? 'PALABRA' : 'COLOR';

  return (
    <div className="grid min-h-[154px] place-items-center">
      <AnimatePresence mode="wait">
        {show ? (
          <motion.div
            key={round.id}
            className="grid place-items-center gap-3 text-center"
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-normal text-slate-500 shadow-soft">
              Recuerda el {targetText}
            </span>
            <motion.strong
              className={`text-6xl font-black tracking-normal sm:text-7xl ${COLORS[round.ink].className}`}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
            >
              {COLORS[round.word].label}
            </motion.strong>
          </motion.div>
        ) : (
          <motion.div
            key="hidden"
            className="rounded-full bg-white/70 px-5 py-3 text-sm font-black uppercase text-slate-500 shadow-soft"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            Elige el vaso correcto
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
