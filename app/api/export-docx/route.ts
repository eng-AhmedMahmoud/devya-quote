import { NextResponse } from 'next/server';
import {
  Document,
  Packer,
  PageOrientation,
} from 'docx';

import { FONT_AR, FONT_LATIN } from '@/lib/docx/colors';
import {
  makeCover,
  makeFooterStrip,
  makeHeaderStrip,
  makeParty,
  makePaymentTermsTable,
  makeSectionHeading,
  makeServicesTable,
  makeTotalsBlock,
} from '@/lib/docx/builders';
import { getUsdRates } from '@/lib/fx';
import { webFxFor } from '@/lib/docx/builders';
import { CURRENCIES, calc, WEB_TIERS, type QuoteState } from '@/lib/pricing';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

type Lang = 'en' | 'ar';

interface Body {
  lang?: Lang;
  state: QuoteState;
  clientName?: string;
  clientCompany?: string;
}

/* ----------------------------------------------------------------- */
/* Body validation                                                    */
/* ----------------------------------------------------------------- */

const WEB_TIER_IDS = new Set<string>(WEB_TIERS.map((t) => t.id));
const CURRENCY_CODES = new Set<string>(CURRENCIES.map((c) => c.code));

function isQuoteState(v: unknown): v is QuoteState {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  for (const k of ['designs', 'videos', 'adBudget']) {
    if (typeof s[k] !== 'number' || !Number.isFinite(s[k] as number)) return false;
  }
  for (const k of ['content', 'adsOn', 'web']) {
    if (typeof s[k] !== 'boolean') return false;
  }
  // Optional for backwards compatibility with links saved before web tiers existed.
  if (s.webTier != null && !(typeof s.webTier === 'string' && WEB_TIER_IDS.has(s.webTier))) {
    return false;
  }
  if (s.currency != null && !(typeof s.currency === 'string' && CURRENCY_CODES.has(s.currency))) {
    return false;
  }
  return true;
}

function validate(body: unknown): { ok: true; data: Required<Pick<Body, 'lang' | 'state'>> & Body } | { ok: false; reason: string } {
  if (!body || typeof body !== 'object') return { ok: false, reason: 'body must be an object' };
  const b = body as Body;
  const lang: Lang = b.lang === 'ar' ? 'ar' : 'en';
  if (!isQuoteState(b.state)) {
    return { ok: false, reason: 'state must include numeric designs/videos/adBudget, boolean content/adsOn/web, and an optional valid webTier' };
  }
  return {
    ok: true,
    data: {
      lang,
      state: b.state,
      clientName: typeof b.clientName === 'string' ? b.clientName : '',
      clientCompany: typeof b.clientCompany === 'string' ? b.clientCompany : '',
    },
  };
}

/* ----------------------------------------------------------------- */
/* Filename slug                                                      */
/* ----------------------------------------------------------------- */

function slug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[؀-ۿ]+/g, '') // strip Arabic codepoints — they break filenames on some shells
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function todayIso(): string {
  // Local-time YYYY-MM-DD; avoids UTC-shifted filenames at midnight Cairo.
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function todayDisplay(lang: Lang): string {
  const d = new Date();
  try {
    return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return todayIso();
  }
}

/* ----------------------------------------------------------------- */
/* POST handler                                                       */
/* ----------------------------------------------------------------- */

export async function POST(req: Request) {
  // Per-IP rate limit before any parsing or docx work — this route is
  // unauthenticated and DOCX generation is CPU-heavy (DoS surface, S24).
  // Middleware skips /api/* in this app, so the handler must enforce it.
  const rate = checkRateLimit(getClientIp(req));
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  const v = validate(raw);
  if (!v.ok) {
    return NextResponse.json({ error: v.reason }, { status: 400 });
  }
  const { lang, state, clientName, clientCompany } = v.data;
  const isAr = lang === 'ar';

  const c = calc(state);

  // Daily USD→currency rates for the web-project rows; cached upstream, so
  // this is effectively free on repeat exports.
  const { rates } = await getUsdRates();
  const webFx = webFxFor(state, rates, isAr);

  // Prefer the company name on the cover when both are provided — feels more
  // formal on a quote.  Fall back to person, then to a blank cover.
  const headlineName =
    (clientCompany && clientCompany.trim()) ||
    (clientName && clientName.trim()) ||
    '';

  const today = todayDisplay(lang);

  const fontName = isAr ? FONT_AR : FONT_LATIN;

  const servicesHeading = makeSectionHeading(
    isAr,
    isAr ? 'الخدمات والتسعير' : 'Services & pricing',
  );
  const totalsHeading = makeSectionHeading(
    isAr,
    isAr ? 'الإجمالي' : 'Totals',
  );

  const doc = new Document({
    creator: 'Devya Solutions',
    title: `Devya quote — ${headlineName || 'Untitled'}`,
    styles: {
      default: {
        document: {
          run: {
            font: { name: fontName, hint: 'eastAsia' as const },
            size: 22,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1400, right: 1100, bottom: 1100, left: 1100 },
            size: { orientation: PageOrientation.PORTRAIT },
          },
        },
        headers: { default: makeHeaderStrip(isAr) },
        footers: { default: makeFooterStrip(isAr) },
        children: [
          ...makeCover(isAr, today),
          ...makeParty(isAr),
          servicesHeading,
          makeServicesTable(isAr, state, c, webFx),
          totalsHeading,
          makeTotalsBlock(isAr, c, state, webFx),
          ...makePaymentTermsTable(isAr),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const bytes = new Uint8Array(buffer);

  const clientSlug =
    slug(clientCompany || '') ||
    slug(clientName || '') ||
    'untitled';
  const filename = `devya-quote-${clientSlug}-${todayIso()}.docx`;

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
