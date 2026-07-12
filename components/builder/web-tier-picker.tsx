'use client';

import { Check } from 'lucide-react';
import type { Lang, MessagesShape } from '@/lib/messages';
import {
  WEB_TIERS,
  tierEgpLabel,
  tierUsdLabel,
  type WebTierId,
} from '@/lib/pricing';

interface Props {
  value: WebTierId | null;
  onChange: (id: WebTierId | null) => void;
  lang: Lang;
  dict: MessagesShape['services']['web'];
  rate: number;
}

export function WebTierPicker({ value, onChange, lang, dict, rate }: Props) {
  const currency = lang === 'ar' ? 'ج.م' : 'EGP';

  return (
    <div role="radiogroup" aria-label={dict.chooseLabel} className="mt-1">
      <span className="block text-[14px] font-medium text-zinc-400 mb-2.5">
        {dict.chooseLabel}
      </span>

      <div className="grid gap-2">
        {WEB_TIERS.map((tier) => {
          const copy = dict.tiers[tier.id];
          const selected = value === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(selected ? null : tier.id)}
              className={`w-full text-start rounded-2xl border px-4 py-3 transition-colors ${
                selected
                  ? 'border-white bg-white/[0.07]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/25'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span
                    aria-hidden
                    className={`mt-0.5 flex-none h-4 w-4 rounded-full border flex items-center justify-center ${
                      selected ? 'border-white bg-white' : 'border-white/25'
                    }`}
                  >
                    {selected && <Check className="h-3 w-3 text-zinc-950" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[15px] font-semibold leading-tight ${selected ? 'text-white' : 'text-zinc-200'}`}>
                      {copy.name}
                    </span>
                    <span className="block text-[13px] text-zinc-500 mt-1 leading-relaxed">
                      {copy.desc}
                    </span>
                    <span className="block text-[12px] text-zinc-600 mt-1">{copy.who}</span>
                  </span>
                </div>
                <span className="flex-none text-end">
                  <span className={`block font-mono font-bold text-[15px] whitespace-nowrap ${selected ? 'text-white' : 'text-zinc-200'}`}>
                    {tierUsdLabel(tier, dict.from)}
                  </span>
                  <span className="block font-mono text-[12px] text-zinc-500 mt-1 whitespace-nowrap">
                    {dict.approx} {tierEgpLabel(tier, rate, dict.from, currency)}
                  </span>
                </span>
              </div>
            </button>
          );
        })}

        {/* "Not sure yet" keeps the old scoped-on-a-call path one tap away */}
        <button
          type="button"
          role="radio"
          aria-checked={value === null}
          onClick={() => onChange(null)}
          className={`w-full text-start rounded-2xl border px-4 py-3 transition-colors ${
            value === null
              ? 'border-white/40 bg-white/[0.05]'
              : 'border-dashed border-white/10 bg-transparent hover:border-white/25'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span>
              <span className={`block text-[15px] font-semibold ${value === null ? 'text-white' : 'text-zinc-300'}`}>
                {dict.notSure}
              </span>
              <span className="block text-[13px] text-zinc-500 mt-0.5">{dict.notSureDesc}</span>
            </span>
            <span className="flex-none font-mono text-[15px] text-zinc-400 whitespace-nowrap">
              {dict.onDemand}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
