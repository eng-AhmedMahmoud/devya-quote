import type { ReactNode } from 'react';

interface Props {
  title: string;
  desc: string;
  lineLabel: string;
  hint?: string;
  children: ReactNode;
}

export function ServiceCard({ title, desc, lineLabel, hint, children }: Props) {
  return (
    <div className="surface p-5 sm:p-6 mb-4 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-sora font-semibold text-[18px] text-white leading-tight">{title}</h3>
          <p className="text-[14px] text-zinc-400 mt-1 max-w-[42ch]">{desc}</p>
        </div>
        <div className="font-mono font-bold text-[16px] text-zinc-200 whitespace-nowrap flex-none">
          {lineLabel}
        </div>
      </div>
      <div className="mt-4">{children}</div>
      {hint && <div className="text-[13px] text-zinc-500 mt-3">{hint}</div>}
    </div>
  );
}
