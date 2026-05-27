import { Howl } from 'howler';

type SoundName = 'tap' | 'success' | 'fail' | 'shuffle' | 'start';

let enabled = true;
let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  audioContext ??= new AudioContext();
  return audioContext;
}

function tone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.025) {
  const context = getAudioContext();
  if (!enabled || !context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

const silentHowl = new Howl({ src: ['data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='], volume: 0 });

export const sound = {
  setEnabled(value: boolean) {
    enabled = value;
  },
  unlock() {
    silentHowl.play();
    void getAudioContext()?.resume();
  },
  play(name: SoundName) {
    if (!enabled) return;
    if (name === 'tap') tone(420, 0.035, 'sine', 0.018);
    if (name === 'shuffle') tone(260, 0.032, 'triangle', 0.012);
    if (name === 'success') {
      tone(520, 0.06, 'sine', 0.022);
      window.setTimeout(() => tone(720, 0.07, 'sine', 0.02), 70);
    }
    if (name === 'fail') tone(180, 0.08, 'triangle', 0.018);
    if (name === 'start') {
      tone(440, 0.055, 'sine', 0.02);
      window.setTimeout(() => tone(620, 0.06, 'sine', 0.018), 65);
    }
  },
};
