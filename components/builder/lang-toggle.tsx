'use client';

import { Languages } from 'lucide-react';
import type { Lang } from '@/lib/messages';

interface Props {
  lang: Lang;
  onChange: (l: Lang) => void;
}

export function LangToggle({ lang, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.02] p-0.5 h-8">
      <button
        type="button"
        onClick={() => onChange('ar')}
        className={`inline-flex items-center gap-1 px-2.5 h-7 text-xs rounded-sm transition ${
          lang === 'ar' ? 'bg-white text-zinc-950 font-medium' : 'text-zinc-400 hover:text-white'
        }`}
        aria-pressed={lang === 'ar'}
      >
        {lang === 'ar' && <Languages className="h-3 w-3" />}
        AR
      </button>
      <button
        type="button"
        onClick={() => onChange('en')}
        className={`inline-flex items-center gap-1 px-2.5 h-7 text-xs rounded-sm transition ${
          lang === 'en' ? 'bg-white text-zinc-950 font-medium' : 'text-zinc-400 hover:text-white'
        }`}
        aria-pressed={lang === 'en'}
      >
        {lang === 'en' && <Languages className="h-3 w-3" />}
        EN
      </button>
    </div>
  );
}
