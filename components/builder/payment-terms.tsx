import type { Lang } from '@/lib/messages';
import { MESSAGES } from '@/lib/messages';

interface Props {
  lang: Lang;
}

export function PaymentTerms({ lang }: Props) {
  const t = MESSAGES[lang].payRows;
  const notes = MESSAGES[lang].payNotes;

  return (
    <section className="py-12 sm:py-16 border-t border-white/5">
      <div className="container mx-auto px-5 sm:px-8 max-w-[1180px]">
        <span className="inline-flex items-center gap-2.5 text-[13px] font-bold text-zinc-400">
          <span className="block w-6 h-0.5 rounded bg-gradient-to-b from-white to-zinc-400" />
          {t.eyebrow}
        </span>
        <h2 className="font-sora font-bold text-3xl sm:text-4xl text-white mt-3.5 leading-tight">
          {t.h2}
        </h2>
        <p className="mt-3.5 text-zinc-400 max-w-[64ch] text-base">{t.lead}</p>

        <div className="grid gap-3.5 mt-7">
          {t.rows.map((row, i) => (
            <div
              key={i}
              className="surface flex flex-col sm:flex-row gap-3 sm:gap-5 items-start p-5 sm:p-6"
            >
              <div className="flex-none w-full sm:w-[172px]">
                <span
                  className={`inline-block font-medium text-xs rounded-full px-3 py-1 mb-2 ${
                    row.soft
                      ? 'bg-white/[0.04] text-zinc-300 border border-white/10'
                      : 'bg-white text-zinc-950'
                  }`}
                >
                  {row.wtag}
                </span>
                <small className="block text-xs text-zinc-500 font-mono">{row.small}</small>
              </div>
              <div className="flex-1 min-w-0">
                <b className="font-sora font-semibold text-base text-white block mb-1">
                  {row.name}
                </b>
                <p className="text-sm text-zinc-400 leading-relaxed">{row.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2.5 mt-6">
          {notes.map((n, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-xs text-zinc-300 bg-white/[0.03] border border-white/10 rounded-full px-3.5 py-1.5"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
