'use client';

import { CURRENCIES, type CurrencyCode } from '@/lib/pricing';

interface Props {
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
  label: string;
}

/** Global display-currency selector — drives the whole quote, not just web tiers. */
export function CurrencyPicker({ value, onChange, label }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      <span className="text-[13px] text-zinc-500">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex gap-1.5 flex-wrap">
        {CURRENCIES.map((c) => {
          const active = c.code === value;
          return (
            <button
              key={c.code}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(c.code)}
              className={`font-mono font-bold text-[13px] px-3 py-1.5 rounded-full border transition ${
                active
                  ? 'bg-white text-zinc-950 border-white'
                  : 'bg-white/[0.03] text-zinc-400 border-white/10 hover:border-white/30 hover:text-zinc-200'
              }`}
            >
              {c.code}
            </button>
          );
        })}
      </div>
    </div>
  );
}
