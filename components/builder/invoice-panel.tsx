'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Printer, ExternalLink, Link2 } from 'lucide-react';
import { CurrencyGlyph } from '@/components/ui/currency-glyph';
import type { Lang } from '@/lib/messages';
import { MESSAGES } from '@/lib/messages';
import { buildShareUrl, encodeQuoteState, quoteRef } from '@/lib/quote-ref';
import type { RegionConfig } from '@/lib/region';
import {
  PRICE,
  calc,
  currencySymbol,
  egpTo,
  fmt,
  fmtFx,
  getWebTier,
  tierRegionAmount,
  tierRegionUsdLabel,
  type CurrencyCode,
  type QuoteState,
} from '@/lib/pricing';

interface Props {
  state: QuoteState;
  lang: Lang;
  defaultAdBudget: number;
  fxRates: Record<CurrencyCode, number>;
  regionCfg: RegionConfig;
}

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || 'https://booking.devya.dev';

function Row({
  name,
  sub,
  val,
  variant,
}: {
  name: string;
  sub?: string;
  val: ReactNode;
  variant?: 'normal' | 'sub' | 'mgmt';
}) {
  const isSub = variant === 'sub';
  const isMgmt = variant === 'mgmt';
  return (
    <div
      className={`flex items-baseline justify-between gap-3 py-2.5 border-b border-dashed border-white/5 ${
        isSub ? 'border-b border-solid border-white/10 border-t border-t-white/5 mt-1.5' : ''
      }`}
    >
      <span
        className={`text-[15px] ${
          isSub ? 'text-white font-semibold' : isMgmt ? 'text-zinc-200' : 'text-zinc-400'
        }`}
      >
        {name}
        {sub && <span className="block text-[12px] text-zinc-500 font-mono mt-0.5">{sub}</span>}
      </span>
      <span
        className={`font-mono font-bold text-[16px] whitespace-nowrap ${
          isSub ? 'text-white' : isMgmt ? 'text-zinc-200' : 'text-white'
        }`}
      >
        {val}
      </span>
    </div>
  );
}

export function InvoicePanel({ state, lang, fxRates, regionCfg }: Props) {
  const c = calc(state);
  const t = MESSAGES[lang].invoice;
  const w = MESSAGES[lang].services.web;
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  const ref = quoteRef(state);

  const any = state.designs > 0 || state.videos > 0 || state.content || state.adsOn;
  const webTier = state.web ? getWebTier(state.webTier) : null;
  const displayCurrency = state.currency ?? regionCfg.currencies[0];
  const fxRate = fxRates[displayCurrency];
  const fxSymbol = currencySymbol(displayCurrency, lang === 'ar');
  const isEgp = displayCurrency === 'EGP';
  const glyph = <CurrencyGlyph code={displayCurrency} isAr={lang === 'ar'} />;
  // Retainer amounts are EGP-native; render them in the selected display currency
  const money = (egp: number): ReactNode => (
    <>{fmtFx(egpTo(egp, fxRates, displayCurrency))} {glyph}</>
  );
  const unitOf = (egp: number) => fmtFx(egpTo(egp, fxRates, displayCurrency));

  function handlePrintPreview() {
    const qs = new URLSearchParams({
      lang,
      s: encodeQuoteState(state),
      auto: '1',
    });
    window.open(`/preview?${qs.toString()}`, '_blank', 'noopener');
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(buildShareUrl(state, lang));
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  // Carry the inquiry into the booking so the meeting starts from this exact
  // quote. Set post-hydration — the share URL needs window.location.origin.
  const [bookHref, setBookHref] = useState(BOOKING_URL);
  useEffect(() => {
    const qs = new URLSearchParams({
      quote_ref: ref,
      quote_link: buildShareUrl(state, lang),
    });
    setBookHref(`${BOOKING_URL}?${qs.toString()}`);
  }, [state, lang, ref]);

  return (
    <div className="surface-strong p-6 shadow-[0_26px_64px_-26px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-2">
        <span className="font-sora font-bold text-[19px] text-white">{t.kick}</span>
        <span className="text-end">
          <span className="block text-[12px] text-zinc-500 font-medium tracking-wide uppercase">{t.mo}</span>
          <span className="block font-mono text-[11px] text-zinc-600 mt-0.5">{t.refLabel} · {ref}</span>
        </span>
      </div>

      <div>
        {!any && !webTier && (
          <div className="text-center text-[15px] text-zinc-500 py-5">{t.empty}</div>
        )}

        {state.designs > 0 && (
          <Row
            name={t.rowDesigns}
            sub={t.rowDesignsHint(state.designs, unitOf(c.dUnit), state.designs > 30)}
            val={money(c.designs)}
          />
        )}
        {state.videos > 0 && (
          <Row
            name={t.rowVideos}
            sub={t.rowVideosHint(state.videos, unitOf(PRICE.video))}
            val={money(c.videos)}
          />
        )}
        {state.content && (
          <Row name={t.rowContent} sub={t.contentFixedHint} val={money(c.content)} />
        )}
        {state.adsOn && (
          <Row name={t.rowAds} sub={t.adsPlatformHint} val={money(c.adEff)} />
        )}

        {any && (
          <>
            <Row name={t.rowSubtotal} val={money(c.subtotal)} variant="sub" />
            <Row name={t.rowMgmt} sub={t.mgmtHint} val={money(c.mgmt)} variant="mgmt" />
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t-2 border-white/10">
        <span className="font-sora font-bold text-[17px] text-white">{t.total}</span>
        <span className="text-end">
          <span className="block font-sora font-extrabold text-[32px] leading-none grad-text tabular-nums">
            {any ? money(c.total) : '0'}
          </span>
          {any && !isEgp && (
            <span className="block font-mono text-[12px] text-zinc-500 mt-1.5 tabular-nums">
              = {fmt(c.total)} {lang === 'ar' ? 'ج.م' : 'EGP'}
            </span>
          )}
        </span>
      </div>

      {/* One-off web project — priced in USD, outside the monthly total */}
      {webTier && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[14px] font-semibold text-zinc-200">{t.webProjectTitle}</span>
            <span className="font-mono font-bold text-[16px] text-white whitespace-nowrap">
              {tierRegionAmount(webTier, regionCfg.upliftUsd[webTier.id], fxRate, w.from)} {glyph}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-3 mt-1">
            <span className="text-[13px] text-zinc-500">{w.tiers[webTier.id].name}</span>
            {regionCfg.showUsdBand && displayCurrency !== 'USD' && (
              <span className="font-mono text-[13px] text-zinc-400 whitespace-nowrap">
                {w.approx} {tierRegionUsdLabel(webTier, regionCfg.upliftUsd[webTier.id], w.from)}
              </span>
            )}
          </div>
          <p className="text-[12px] text-zinc-500 mt-2 leading-relaxed">{t.webProjectNote}</p>
          <p className="text-[12px] text-zinc-500 mt-1 leading-relaxed">{w.devOnlyNote}</p>
        </div>
      )}

      <div className="text-[13px] text-zinc-500 mt-4 leading-relaxed space-y-1.5">
        {state.web && !webTier && (
          <p>
            <span className="text-zinc-200 font-semibold">{t.footnoteWeb}</span>
          </p>
        )}
        {!isEgp && <p>{t.fxDisplayNote(fxSymbol)}</p>}
        <p>{t.footnoteEstim}</p>
      </div>

      <div className="flex gap-2 mt-5 flex-wrap">
        <button
          type="button"
          onClick={handlePrintPreview}
          className="flex-1 inline-flex items-center justify-center gap-2 font-medium text-[15px] text-zinc-950 bg-white rounded-full px-4 py-3 transition hover:bg-zinc-200 whitespace-nowrap"
        >
          <Printer className="h-4 w-4" />
          {t.save}
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center justify-center gap-2 font-medium text-[15px] text-white bg-transparent border border-white/10 rounded-full px-4 py-3 transition hover:bg-white/5 hover:border-white whitespace-nowrap"
          aria-label={t.copyLink}
          title={t.copyLink}
        >
          <Link2 className="h-4 w-4" />
          <span className="text-[13px]">{copied ? t.copied : ''}</span>
        </button>
        <a
          href={bookHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 font-medium text-[15px] text-white bg-transparent border border-white/10 rounded-full px-4 py-3 transition hover:bg-white/5 hover:border-white whitespace-nowrap"
        >
          {t.book}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
