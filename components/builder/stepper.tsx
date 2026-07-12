'use client';

import type { ReactNode } from 'react';
import { Minus, Plus } from 'lucide-react';

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  ariaLabelDec: string;
  ariaLabelInc: string;
  unit?: ReactNode;
}

export function Stepper({ value, onChange, min = 0, ariaLabelDec, ariaLabelInc, unit }: Props) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(value + 1);

  const btn =
    'inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-white/[0.03] text-zinc-200 transition hover:bg-white hover:text-zinc-950 hover:border-white active:scale-95';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button type="button" className={btn} onClick={dec} aria-label={ariaLabelDec}>
        <Minus className="h-4 w-4" />
      </button>
      <span className="font-mono font-bold text-[21px] text-white min-w-[2.5rem] text-center tabular-nums">
        {value}
      </span>
      <button type="button" className={btn} onClick={inc} aria-label={ariaLabelInc}>
        <Plus className="h-4 w-4" />
      </button>
      {unit && <span className="text-[13px] text-zinc-400">{unit}</span>}
    </div>
  );
}
