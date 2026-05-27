import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createRound, MAX_ROUNDS, type Phase, type Round, type Screen } from '../lib/game';

type Result = {
  score: number;
  round: number;
  highScore: number;
  accuracy: number;
  won: boolean; // completed all MAX_ROUNDS
};

type GameState = {
  screen: Screen;
  phase: Phase;
  roundNumber: number;
  score: number;
  lives: number;
  streak: number;
  attempts: number;
  correct: number;
  highScore: number;
  soundEnabled: boolean;
  playerName: string;
  round: Round | null;
  selectedCup: number | null;
  lastCorrect: boolean | null;
  finalResult: Result | null;
  setScreen: (screen: Screen) => void;
  setPlayerName: (name: string) => void;
  startGame: (name: string) => void;
  startRound: () => void;
  setPhase: (phase: Phase) => void;
  setCupOrder: (order: number[]) => void;
  chooseCup: (cup: number, isCorrect: boolean) => void;
  continueAfterResult: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  toggleSound: () => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: 'home',
      phase: 'ready',
      roundNumber: 1,
      score: 0,
      lives: 3,
      streak: 0,
      attempts: 0,
      correct: 0,
      highScore: 0,
      soundEnabled: true,
      playerName: '',
      round: null,
      selectedCup: null,
      lastCorrect: null,
      finalResult: null,
      setScreen: (screen) => set({ screen }),
      setPlayerName: (name) => set({ playerName: name }),
      startGame: (name) =>
        set({
          screen: 'game',
          phase: 'memorize',
          roundNumber: 1,
          score: 0,
          lives: 3,
          streak: 0,
          attempts: 0,
          correct: 0,
          selectedCup: null,
          lastCorrect: null,
          finalResult: null,
          playerName: name,
          round: createRound(1),
        }),
      startRound: () => {
        const nextRound = get().roundNumber;
        set({
          screen: 'game',
          phase: 'memorize',
          selectedCup: null,
          lastCorrect: null,
          round: createRound(nextRound),
        });
      },
      setPhase: (phase) => set({ phase }),
      setCupOrder: (order) =>
        set((state) => ({
          round: state.round ? { ...state.round, cupOrder: order } : state.round,
        })),
      chooseCup: (cup, isCorrect) =>
        set((state) => {
          if (state.phase !== 'guess') return state;
          const nextAttempts = state.attempts + 1;
          const nextCorrect = state.correct + (isCorrect ? 1 : 0);
          const nextStreak = isCorrect ? state.streak + 1 : 0;
          const bonus = isCorrect ? 100 + state.roundNumber * 18 + nextStreak * 8 : 0;
          const nextScore = state.score + bonus;
          const nextLives = state.lives - (isCorrect ? 0 : 1);
          const nextHighScore = Math.max(state.highScore, nextScore);
          const accuracy = Math.round((nextCorrect / nextAttempts) * 100);

          // Game over — out of lives
          if (nextLives <= 0) {
            return {
              phase: 'result',
              screen: 'results',
              selectedCup: cup,
              lastCorrect: false,
              attempts: nextAttempts,
              correct: nextCorrect,
              streak: 0,
              score: nextScore,
              lives: 0,
              highScore: nextHighScore,
              finalResult: {
                score: nextScore,
                round: state.roundNumber,
                highScore: nextHighScore,
                accuracy,
                won: false,
              },
            };
          }

          return {
            phase: 'result',
            selectedCup: cup,
            lastCorrect: isCorrect,
            attempts: nextAttempts,
            correct: nextCorrect,
            streak: nextStreak,
            score: nextScore,
            lives: nextLives,
            highScore: nextHighScore,
          };
        }),
      continueAfterResult: () =>
        set((state) => {
          if (state.lastCorrect) {
            const nextRound = state.roundNumber + 1;
            const accuracy = Math.round((state.correct / state.attempts) * 100);

            // Victory — completed all rounds
            if (nextRound > MAX_ROUNDS) {
              return {
                screen: 'results',
                phase: 'result',
                selectedCup: null,
                lastCorrect: null,
                finalResult: {
                  score: state.score,
                  round: MAX_ROUNDS,
                  highScore: state.highScore,
                  accuracy,
                  won: true,
                },
              };
            }

            return {
              roundNumber: nextRound,
              phase: 'memorize',
              selectedCup: null,
              lastCorrect: null,
              round: createRound(nextRound),
            };
          }
          // Wrong answer — retry same round
          return {
            phase: 'memorize',
            selectedCup: null,
            lastCorrect: null,
            round: createRound(state.roundNumber),
          };
        }),
      pause: () => set({ screen: 'pause' }),
      resume: () => set({ screen: 'game' }),
      restart: () => get().startGame(get().playerName),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: 'memocups-progress',
      partialize: (state) => ({ highScore: state.highScore, soundEnabled: state.soundEnabled }),
    },
  ),
);
