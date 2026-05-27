import { AnimatePresence, motion } from 'framer-motion';
import { GameScreen } from './components/GameScreen';
import { HomeScreen } from './components/HomeScreen';
import { OverlayScreen } from './components/OverlayScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { useGameStore } from './store/gameStore';
import { sound } from './lib/sound';

export default function App() {
  const screen = useGameStore((state) => state.screen);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  sound.setEnabled(soundEnabled);

  return (
    <main className="min-h-dvh overflow-hidden bg-[#f8fbff] font-display text-slate-800">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(253,186,116,.36),transparent_26%),radial-gradient(circle_at_85%_14%,rgba(125,211,252,.42),transparent_28%),radial-gradient(circle_at_50%_92%,rgba(167,243,208,.5),transparent_30%),linear-gradient(180deg,#fef7ff_0%,#eff8ff_52%,#f0fdf4_100%)]" />
      <div className="fixed inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(34,197,94,.15))]" />
      <motion.div
        aria-hidden
        className="fixed left-4 top-28 h-20 w-20 rounded-[36%] bg-white/60 blur-[1px]"
        animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="fixed right-6 top-20 h-14 w-14 rounded-[42%] bg-amber-200/70 blur-[1px]"
        animate={{ y: [0, 12, 0], rotate: [0, -7, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <section className="relative mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {screen === 'home' && <HomeScreen key="home" />}
          {screen === 'game' && <GameScreen key="game" />}
          {screen === 'pause' && <OverlayScreen key="pause" type="pause" />}
          {screen === 'results' && <ResultsScreen key="results" />}
        </AnimatePresence>
      </section>
    </main>
  );
}
