import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

const tones = {
  primary: 'bg-sky-500 text-white shadow-[0_8px_0_#0284c7] active:shadow-[0_4px_0_#0284c7]',
  secondary: 'bg-amber-300 text-slate-900 shadow-[0_8px_0_#f59e0b] active:shadow-[0_4px_0_#f59e0b]',
  ghost: 'bg-white/70 text-slate-700 shadow-[0_7px_0_rgba(148,163,184,.45)] active:shadow-[0_4px_0_rgba(148,163,184,.45)]',
  danger: 'bg-rose-500 text-white shadow-[0_8px_0_#be123c] active:shadow-[0_4px_0_#be123c]',
};

export function Button({ children, className = '', tone = 'primary', ...props }: Props) {
  return (
    <button
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-[22px] px-6 py-3 text-base font-black transition-[transform,box-shadow,filter] duration-150 ease-out active:translate-y-1 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
