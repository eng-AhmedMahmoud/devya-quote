'use client';

import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { DevyaMark } from '@/components/ui/devya-logo';
import { MESSAGES, type Lang } from '@/lib/messages';
import {
  DEFAULT_CURRENCY,
  calc,
  currencySymbol,
  egpTo,
  fmtFx,
  getWebTier,
  tierUsdLabel,
  type QuoteState,
} from '@/lib/pricing';
import { useUsdRates } from '@/lib/use-fx';
import { LangToggle } from './lang-toggle';
import { Stepper } from './stepper';
import { Switch } from './switch';
import { BudgetInput } from './budget-input';
import { ServiceCard } from './service-card';
import { InvoicePanel } from './invoice-panel';
import { PaymentTerms } from './payment-terms';
import { IntroSection } from './intro-section';
import { FooterBlock } from './footer-block';
import { WebTierPicker } from './web-tier-picker';
import { CurrencyPicker } from './currency-picker';

export function QuoteBuilder() {
  const [lang, setLang] = useState<Lang>('ar');
  const [state, setState] = useState<QuoteState>({
    designs: 20,
    videos: 8,
    content: true,
    adsOn: true,
    adBudget: 30000,
    web: false,
    webTier: null,
    currency: DEFAULT_CURRENCY,
  });

  const dict = useMemo(() => MESSAGES[lang], [lang]);
  const c = useMemo(() => calc(state), [state]);
  const fx = useUsdRates();

  const dash = '—';
  const zero = lang === 'ar' ? '٠' : '0';

  const isRtl = lang === 'ar';
  const fontFamily = isRtl ? 'font-amiri' : 'font-sora';

  function patch<K extends keyof QuoteState>(key: K, value: QuoteState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  const displayCurrency = state.currency ?? DEFAULT_CURRENCY;
  const fxRate = fx.rates[displayCurrency];
  const fxSymbol = currencySymbol(displayCurrency, isRtl);
  // EGP-native retainer amounts rendered in the selected display currency
  const money = (egp: number) => `${fmtFx(egpTo(egp, fx.rates, displayCurrency))} ${fxSymbol}`;

  // Lines shown next to each service-card head
  const lineDesigns = state.designs > 0 ? money(c.designs) : zero;
  const lineVideos = state.videos > 0 ? money(c.videos) : zero;
  const lineContent = state.content ? money(c.content) : zero;
  const lineAds = state.adsOn ? money(c.adEff) : zero;
  const webTier = getWebTier(state.webTier);
  const lineWeb = state.web
    ? webTier
      ? tierUsdLabel(webTier, dict.services.web.from)
      : dict.services.web.onDemand
    : dash;
  const fxRateLabel = fxRate < 2 ? fxRate.toFixed(3) : fxRate.toFixed(2);
  const webHint = fx.live
    ? dict.services.web.fxNote(fxRateLabel, fxSymbol)
    : dict.services.web.fxNoteFallback(fxRateLabel, fxSymbol);

  // Dynamic hints
  const designsHint = state.designs > 30
    ? (isRtl
        ? 'كمية كبيرة — بنأكّد سعر خاص في اجتماع.'
        : 'Large volume — we agree a custom rate on a call.')
    : dict.services.designs.hint;
  const videosHint = state.videos > 20
    ? (isRtl
        ? 'كمية كبيرة — بنأكّد سعر خاص في اجتماع.'
        : 'Large volume — we agree a custom rate on a call.')
    : dict.services.videos.hint;

  const designUnitDisplay = c.dUnit ? fmtFx(egpTo(c.dUnit, fx.rates, displayCurrency)) : dash;
  const videoUnitDisplay = fmtFx(egpTo(350, fx.rates, displayCurrency));

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={lang}
      className={`min-h-screen bg-grid text-zinc-100 ${fontFamily}`}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/10">
        <div className="container mx-auto px-5 sm:px-8 max-w-[1180px] h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DevyaMark size={26} className="text-white" />
            <span className="font-sora font-semibold tracking-[0.22em] text-white text-[17px] uppercase">
              Devya
            </span>
            <span className="hidden sm:block h-5 w-px bg-white/10" />
            <span className="hidden sm:block text-[13px] text-zinc-400 font-medium">
              {dict.brand.sub}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <LangToggle lang={lang} onChange={setLang} />
            <a
              href="https://devya.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-950 bg-white rounded-full px-3.5 py-2 transition hover:bg-zinc-200 shadow-[0_10px_26px_-12px_rgba(255,255,255,0.3)]"
            >
              <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              <span className="font-mono">{dict.brand.cta}</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <IntroSection lang={lang} />

        <section className="container mx-auto px-5 sm:px-8 max-w-[1180px]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.9fr] gap-6 lg:gap-8 py-10 sm:py-14 items-start">
            {/* Controls column */}
            <div>
              <span className="block font-medium text-[14px] text-zinc-500 tracking-wide mb-4">
                {dict.invoice.sectionEyebrow}
              </span>

              {/* Display currency — converts the whole quote, retainer and web tiers alike */}
              <CurrencyPicker
                value={displayCurrency}
                onChange={(code) => patch('currency', code)}
                label={dict.services.web.currencyLabel}
              />

              {/* Designs */}
              <ServiceCard
                title={dict.services.designs.name}
                desc={dict.services.designs.desc}
                lineLabel={lineDesigns}
                hint={designsHint}
              >
                <Stepper
                  value={state.designs}
                  onChange={(v) => patch('designs', v)}
                  ariaLabelDec={isRtl ? 'أقل' : 'Decrease'}
                  ariaLabelInc={isRtl ? 'أكتر' : 'Increase'}
                  unit={
                    <span>
                      {dict.qtyUnit.designs} ·{' '}
                      <span className="font-mono text-zinc-300">{designUnitDisplay}</span>{' '}
                      {fxSymbol} {dict.services.designs.unit}
                    </span>
                  }
                />
              </ServiceCard>

              {/* Videos */}
              <ServiceCard
                title={dict.services.videos.name}
                desc={dict.services.videos.desc}
                lineLabel={lineVideos}
                hint={videosHint}
              >
                <Stepper
                  value={state.videos}
                  onChange={(v) => patch('videos', v)}
                  ariaLabelDec={isRtl ? 'أقل' : 'Decrease'}
                  ariaLabelInc={isRtl ? 'أكتر' : 'Increase'}
                  unit={
                    <span>
                      {dict.qtyUnit.videos} ·{' '}
                      <span className="font-mono text-zinc-300">{videoUnitDisplay}</span>{' '}
                      {fxSymbol} {dict.services.videos.unit}
                    </span>
                  }
                />
              </ServiceCard>

              {/* Content */}
              <ServiceCard
                title={dict.services.content.name}
                desc={dict.services.content.desc}
                lineLabel={lineContent}
              >
                <Switch
                  checked={state.content}
                  onChange={(b) => patch('content', b)}
                  label={dict.services.content.toggle}
                />
              </ServiceCard>

              {/* Ads */}
              <ServiceCard
                title={dict.services.ads.name}
                desc={dict.services.ads.desc}
                lineLabel={lineAds}
              >
                <Switch
                  checked={state.adsOn}
                  onChange={(b) => patch('adsOn', b)}
                  label={dict.services.ads.toggle}
                />
                <BudgetInput
                  value={state.adBudget}
                  onChange={(n) => {
                    // Chip clicks / typing also enable ads
                    setState((s) => ({ ...s, adBudget: n, adsOn: true }));
                  }}
                  lang={lang}
                  disabled={!state.adsOn}
                />
              </ServiceCard>

              {/* Web */}
              <ServiceCard
                title={dict.services.web.name}
                desc={dict.services.web.desc}
                lineLabel={lineWeb}
                hint={webHint}
              >
                <Switch
                  checked={state.web}
                  onChange={(b) => patch('web', b)}
                  label={dict.services.web.toggle}
                />
                {/* Tier catalogue is always visible — picking a tier also enables the service */}
                <div className="mt-4">
                  <WebTierPicker
                    value={state.webTier ?? null}
                    onChange={(id) => {
                      setState((s) => ({ ...s, webTier: id, web: true }));
                    }}
                    currency={displayCurrency}
                    lang={lang}
                    dict={dict.services.web}
                    rates={fx.rates}
                  />
                </div>
              </ServiceCard>
            </div>

            {/* Invoice column */}
            <aside className="lg:sticky lg:top-24">
              <span className="block font-medium text-[14px] text-zinc-500 tracking-wide mb-4">
                {dict.invoice.aside}
              </span>
              <InvoicePanel state={state} lang={lang} defaultAdBudget={30000} fxRates={fx.rates} />
            </aside>
          </div>
        </section>

        <PaymentTerms lang={lang} />
      </main>

      <FooterBlock lang={lang} />
    </div>
  );
}
