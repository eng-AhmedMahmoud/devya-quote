import { ArrowUpRight, Gift } from 'lucide-react';
import type { Lang } from '@/lib/messages';

const REWARDS_URL = 'https://rewards.devya.dev';

const COPY: Record<Lang, { eyebrow: string; title: string; text: string; cta: string }> = {
  en: {
    eyebrow: 'Devya Rewards',
    title: 'Get rewarded for building with us',
    text: 'Devya clients earn loyalty points on every project — redeem them for discounts, credits, perks and priority support.',
    cta: 'See the rewards program',
  },
  ar: {
    eyebrow: 'مكافآت Devya',
    title: 'احصل على مكافآت مقابل تعاونك معنا',
    text: 'يكسب عملاء Devya نقاط ولاء على كل مشروع — استبدلها بخصومات وأرصدة ومزايا ودعمٍ ذي أولوية.',
    cta: 'تعرّف على برنامج المكافآت',
  },
};

export function RewardsPromo({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section className="mx-auto mt-10 w-full max-w-3xl px-4">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 end-0 h-40 w-64 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(184,192,204,0.16), transparent)' }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ background: 'rgba(184,192,204,0.14)' }}
          >
            <Gift className="h-6 w-6" style={{ color: '#B8C0CC' }} />
          </span>
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: '#B8C0CC' }}>
              {t.eyebrow}
            </div>
            <h3 className="mt-1 text-lg font-semibold text-white">{t.title}</h3>
            <p className="mt-1 text-sm text-white/60">{t.text}</p>
          </div>
          <a
            href={REWARDS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#B8C0CC] px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] transition-transform hover:scale-[1.03]"
          >
            {t.cta}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
