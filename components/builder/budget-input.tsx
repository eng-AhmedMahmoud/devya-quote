'use client';

import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/messages';
import { PRICE, fmt } from '@/lib/pricing';
import { MESSAGES } from '@/lib/messages';

interface Props {
  value: number;
  onChange: (n: number) => void;
  lang: Lang;
  disabled?: boolean;
}

const CHIPS = [
  { label: '30K', value: 30000 },
  { label: '50K', value: 50000 },
  { label: '100K', value: 100000 },
  { label: '200K', value: 200000 },
];

export function BudgetInput({ value, onChange, lang, disabled }: Props) {
  const [text, setText] = useState(fmt(value));
  const t = MESSAGES[lang].services.ads;

  // Keep input text synced when value updates externally (chip click, etc.)
  useEffect(() => {
    setText(fmt(value));
  }, [value]);

  const belowMin = value < PRICE.adMin;

  return (
    <div className={`mt-4 pt-4 border-t border-white/5 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-1.5 max-w-[260px]">
        <input
          type="text"
          inputMode="numeric"
          dir="ltr"
          aria-label={t.toggle}
          value={text}
          onChange={(e) => {
            const raw = e.target.value;
            setText(raw);
            const n = parseInt(raw.replace(/[^\d]/g, ''), 10) || 0;
            onChange(n);
          }}
          onBlur={() => {
            const n = Math.max(value, PRICE.adMin);
            onChange(n);
            setText(fmt(n));
          }}
          className="flex-1 bg-transparent border-0 outline-none text-white font-mono font-bold text-[19px] w-full"
        />
        <span className="text-[13px] text-zinc-500 whitespace-nowrap">
          {lang === 'ar' ? 'ج.م / شهر' : 'EGP / mo'}
        </span>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap" dir="ltr">
        {CHIPS.map((c) => {
          const active = value === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange(c.value)}
              className={`font-mono font-bold text-[13px] px-3.5 py-1.5 rounded-full border transition ${
                active
                  ? 'bg-white text-zinc-950 border-white'
                  : 'bg-white/[0.03] text-zinc-400 border-white/10 hover:bg-white hover:text-zinc-950 hover:border-white'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className={`text-[13px] mt-3 ${belowMin ? 'text-white font-medium' : 'text-zinc-500'}`}>
        {belowMin ? t.overMin : t.minHint}
      </div>
    </div>
  );
}
