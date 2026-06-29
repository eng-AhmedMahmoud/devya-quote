import type { Lang } from '@/lib/messages';
import { MESSAGES } from '@/lib/messages';

interface Props {
  lang: Lang;
}

export function IntroSection({ lang }: Props) {
  const t = MESSAGES[lang].intro;
  return (
    <section className="py-10 sm:py-14 border-b border-white/5">
      <div className="container mx-auto px-5 sm:px-8 max-w-[1180px]">
        <span className="inline-flex items-center gap-2.5 text-[13px] font-bold text-zinc-400">
          <span className="block w-6 h-0.5 rounded bg-gradient-to-b from-white to-zinc-400" />
          {t.eyebrow}
        </span>
        <h1 className="font-sora font-extrabold text-[clamp(28px,4.6vw,46px)] leading-[1.2] mt-3.5 text-white">
          {t.h1Lead} <span className="grad-text">{t.h1Grad}</span>.
        </h1>
        <p className="mt-4 max-w-[62ch] text-zinc-400 text-[clamp(15px,2vw,18px)] leading-relaxed">
          {t.paragraph}
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          {t.badges.map((b, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 text-zinc-300 font-medium text-xs rounded-full px-3.5 py-2"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
