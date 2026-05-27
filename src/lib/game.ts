export type ColorId = 'red' | 'blue' | 'green' | 'yellow' | 'purple';
export type MemoryMode = 'word' | 'ink';
export type Phase = 'ready' | 'memorize' | 'hide' | 'shuffle' | 'guess' | 'result';
export type Screen = 'home' | 'game' | 'pause' | 'results';

export const MAX_ROUNDS = 10;

export const COLORS: Record<ColorId, { label: string; className: string; hex: string }> = {
  red: { label: 'ROJO', className: 'text-rose-500', hex: '#ef4444' },
  blue: { label: 'AZUL', className: 'text-sky-500', hex: '#0ea5e9' },
  green: { label: 'VERDE', className: 'text-emerald-500', hex: '#10b981' },
  yellow: { label: 'AMARILLO', className: 'text-amber-400', hex: '#f59e0b' },
  purple: { label: 'MORADO', className: 'text-violet-500', hex: '#8b5cf6' },
};

export type Round = {
  id: number;
  word: ColorId;
  ink: ColorId;
  mode: MemoryMode;
  correctCup: number;
  cupOrder: number[];
  shuffleMoves: [number, number][];
};

const colorIds = Object.keys(COLORS) as ColorId[];

export function getDifficulty(round: number) {
  // Rounds 1–4: comfortable warm-up. Round 5+ escalates fast.
  const swapMs =
    round <= 4
      ? Math.max(440, 700 - (round - 1) * 30)   // 700 → 610
      : Math.max(180, 500 - (round - 5) * 64);   // 500 → 180 over rounds 5-10

  const memorizeMs =
    round <= 4
      ? Math.max(1600, 2400 - (round - 1) * 100) // 2400 → 2100
      : Math.max(700, 1800 - (round - 5) * 220); // 1800 → 700 over rounds 5-10

  const swaps =
    round <= 4
      ? 3 + Math.floor(round / 2)                // 3–4
      : Math.min(11, 5 + (round - 5));           // 5–10

  const mismatchChance = Math.min(0.92, 0.44 + round * 0.04);

  return { memorizeMs, swapMs, swaps, mismatchChance };
}

export function createRound(round: number): Round {
  const difficulty = getDifficulty(round);
  const word = pick(colorIds);
  const forceMismatch = Math.random() < difficulty.mismatchChance;
  const ink = forceMismatch ? pick(colorIds.filter((color) => color !== word)) : pick(colorIds);
  const mode: MemoryMode = Math.random() > 0.5 ? 'word' : 'ink';
  const correctCup = randomInt(0, 2);
  const shuffleMoves = createShuffleMoves(difficulty.swaps);
  const cupOrder = [0, 1, 2];

  return {
    id: Date.now(),
    word,
    ink,
    mode,
    correctCup,
    cupOrder,
    shuffleMoves,
  };
}

export function getRoundTarget(round: Round) {
  return round.mode === 'word'
    ? { label: COLORS[round.word].label, className: COLORS[round.word].className }
    : { label: COLORS[round.ink].label, className: COLORS[round.ink].className };
}

export function applyMove(order: number[], [a, b]: [number, number]) {
  const next = [...order];
  const temp = next[a];
  next[a] = next[b];
  next[b] = temp;
  return next;
}

export function cupWithToken(order: number[], tokenCup: number) {
  return order.indexOf(tokenCup);
}

function createShuffleMoves(count: number): [number, number][] {
  return Array.from({ length: count }, () => {
    const a = randomInt(0, 2);
    let b = randomInt(0, 2);
    while (a === b) b = randomInt(0, 2);
    return [a, b];
  });
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
