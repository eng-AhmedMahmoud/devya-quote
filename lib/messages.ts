export type Lang = 'en' | 'ar';
export type Bi<T = string> = Record<Lang, T>;

export type PayRow = {
  wtag: string;
  small: string;
  name: string;
  desc: string;
  soft?: boolean;
};

export type MessagesShape = {
  brand: { sub: string; cta: string };
  intro: {
    eyebrow: string;
    h1Lead: string;
    h1Grad: string;
    paragraph: string;
    badges: string[];
  };
  services: {
    designs: { name: string; desc: string; hint: string; unit: string };
    videos: { name: string; desc: string; hint: string; unit: string };
    content: { name: string; desc: string; toggle: string };
    ads: { name: string; desc: string; toggle: string; minHint: string; overMin: string };
    web: { name: string; desc: string; toggle: string; onDemand: string };
  };
  qtyUnit: { designs: string; videos: string };
  invoice: {
    col: string;
    kick: string;
    mo: string;
    total: string;
    footnoteEstim: string;
    footnoteWeb: string;
    empty: string;
    save: string;
    book: string;
    // row labels
    rowDesigns: string;
    rowVideos: string;
    rowContent: string;
    rowAds: string;
    rowSubtotal: string;
    rowMgmt: string;
    rowDesignsHint: (q: number, unit: number, isSpecial: boolean) => string;
    rowVideosHint: (q: number) => string;
    contentFixedHint: string;
    adsPlatformHint: string;
    mgmtHint: string;
    sectionEyebrow: string;
    aside: string;
    webOnDemand: string;
  };
  payRows: {
    eyebrow: string;
    h2: string;
    lead: string;
    rows: PayRow[];
  };
  payNotes: string[];
  footer: {
    tagline: string;
    copy: string;
    doc: string;
    links: {
      devya: string;
      booking: string;
      portfolio: string;
      contracts: string;
      quote: string;
    };
  };
};

const ar: MessagesShape = {
  brand: { sub: 'عرض سعر تفاعلي', cta: 'devya.dev' },
  intro: {
    eyebrow: 'منشئ عرض السعر',
    h1Lead: 'اختار اللي محتاجه…',
    h1Grad: 'والفاتورة تتحسب لحظيًا',
    paragraph:
      'نموذج شفّاف ومبوّب: بتدفع مقابل الشغل الفعلي (تصميم، فيديو، محتوى، إعلانات)، وبعدين طبقة إدارة واحدة 20% بتغطّي الاستراتيجية والعلامة والميديا باينج والاستشارات. ظبّط الكميات تحت، وعرض السعر ومواعيد الدفع هيظهروا على طول.',
    badges: ['✦ مفيش رسوم مخفية', '📣 ميزانية الإعلانات 100% بتاعتكم', '🧾 إدارة واحدة 20%'],
  },
  services: {
    designs: {
      name: 'التصميمات والكرييتيف',
      desc: 'بوستات سوشيال وإعلانات وفيجوال — السعر بالتدرّج حسب الكمية.',
      hint: 'لحد ١٥ ← ٢٠٠ ج.م · من ١٦ لـ٣٠ ← ١٧٠ ج.م · أكتر من ٣٠ سعر خاص (بنأكّده في اجتماع).',
      unit: 'ج.م للتصميم',
    },
    videos: {
      name: 'مونتاج الفيديو',
      desc: 'مونتاج ريلز وإعلانات. الكميات الكبيرة بسعر خاص.',
      hint: 'متوسط فيديو الدقيقة. لو الكمية كبيرة بنحطّ سعر خاص.',
      unit: 'ج.م للفيديو (متوسط)',
    },
    content: {
      name: 'المحتوى — سكريبتات وخطة',
      desc: 'خطة محتوى شهرية وسكريبتات. بيزيد مع كمية السكريبتات الكبيرة.',
      toggle: 'ضمّ خطة المحتوى — مبلغ ثابت ٢٬٥٠٠ ج.م/شهر',
    },
    ads: {
      name: 'ميزانية الإعلانات',
      desc: 'بتتدفع لميتا / جوجل مباشرة — ١٠٠٪ بتاعتكم، وعمرنا ما بنزوّد عليها.',
      toggle: 'تشغيل إعلانات مدفوعة',
      minHint: 'الحد الأدنى لميزانية الإعلانات ٣٠٬٠٠٠ ج.م/شهر.',
      overMin: '⚠ الحد الأدنى ٣٠٬٠٠٠ ج.م — بنحسب بالحد الأدنى.',
    },
    web: {
      name: 'مواقع وتطبيقات وأنظمة',
      desc: 'بناء متجر، تطوير مخصّص، وداشبوردات — بنحدّدها سوا في اجتماع.',
      toggle: 'محتاج موقع / نظام (حسب الطلب — مش داخل في الشهري)',
      onDemand: 'حسب الطلب',
    },
  },
  qtyUnit: {
    designs: 'تصميم/شهر',
    videos: 'فيديو/شهر',
  },
  invoice: {
    col: '② الفاتورة الشهرية',
    kick: 'عرض السعر',
    mo: 'قيمة شهرية تقديرية',
    total: 'الإجمالي الشهري',
    footnoteEstim: 'الأرقام تقديرية وبتعتمد على الكمية والميزانية اللي بتحدّدوها.',
    footnoteWeb: '+ مواقع/أنظمة: حسب الطلب — بتتسعّر وتتدفع لوحدها على دفعات (مش داخلة في الإجمالي الشهري).',
    empty: 'اختار خدمة واحدة على الأقل عشان نطلّعلك الفاتورة.',
    save: '🧾 احفظ / اطبع العرض',
    book: 'احجز اجتماع',
    rowDesigns: 'التصميمات',
    rowVideos: 'الفيديوهات',
    rowContent: 'خطة المحتوى',
    rowAds: 'ميزانية الإعلانات',
    rowSubtotal: 'الإجمالي الفرعي',
    rowMgmt: 'الإدارة',
    rowDesignsHint: (q, unit, isSpecial) => `${q} × ${unit}${isSpecial ? ' · سعر خاص' : ''}`,
    rowVideosHint: (q) => `${q} × 350`,
    contentFixedHint: 'ثابت/شهر',
    adsPlatformHint: 'بتروح للمنصات',
    mgmtHint: '٢٠٪ على كل المدفوعات',
    sectionEyebrow: '① اختار خدماتك وكمياتها',
    aside: '② الفاتورة الشهرية',
    webOnDemand: 'حسب الطلب',
  },
  payRows: {
    eyebrow: 'مواعيد الدفع',
    h2: 'إمتى بيتدفع كل بند.',
    lead: 'عشان كله يبقى واضح من الأول — ده جدول الدفع المرتبط بالفاتورة اللي فوق.',
    rows: [
      {
        wtag: 'حسب توفّرها',
        small: 'يفضّل أول الشهر',
        name: 'ميزانية الإعلانات (١٠٠٪)',
        desc:
          'بتتدفع حسب توفّرها، ويُفضّل تكون أول الشهر عشان الحملات تشتغل من غير توقف. بتروح للمنصات (ميتا/جوجل) مباشرة. الحد الأدنى ٣٠٬٠٠٠ ج.م/شهر، والمبلغ بالكامل بتاعكم وعمرنا ما بنزوّد عليه.',
        soft: true,
      },
      {
        wtag: 'كل أسبوعين',
        small: 'أو أول الشهر',
        name: 'خطة المحتوى والسكريبتات',
        desc:
          'بتتدفع كل أسبوعين، أو في بداية الشهر — زي ما يناسبكم. القيمة ٢٬٥٠٠ ج.م شهريًا مقابل خطة المحتوى والسكريبتات.',
      },
      {
        wtag: 'أسبوعيًا',
        small: 'آخر كل أسبوع',
        name: 'التصميمات والفيديوهات',
        desc:
          'فوترة أسبوعية حسب اللي اتسلّم فعليًا خلال الأسبوع — فبتدفع مقابل شغل خلص وبين إيديك، مش مقدّمًا.',
        soft: true,
      },
      {
        wtag: 'مع فاتورة الشهر',
        small: '٢٠٪',
        name: 'الإدارة والعلامة والميديا باينج والاستشارات',
        desc:
          'نسبة ٢٠٪ محسوبة على إجمالي مدفوعات الشهر (بما فيها ميزانية الإعلانات) — رقم واحد واضح، وإحنا مسؤولين تمامًا عن النتايج.',
      },
      {
        wtag: 'دفعات المشروع',
        small: 'لو مطلوب',
        name: 'المواقع والتطبيقات والأنظمة',
        desc:
          'بتتسعّر وتتدفع لوحدها على دفعات حسب مراحل المشروع (مثلًا ٥٠٪ مقدّم / ٥٠٪ عند التسليم) — بعد اجتماع نحدّد فيه النطاق. مش جزء من الاشتراك الشهري.',
        soft: true,
      },
    ],
  },
  payNotes: [
    '✦ مفيش رسوم مخفية',
    '📣 ميزانية الإعلانات ١٠٠٪ بتاعتكم',
    '🧾 الإدارة ٢٠٪ على كل المدفوعات',
    '📊 الأرقام تقديرية وبتعتمد على الكمية والميزانية',
  ],
  footer: {
    tagline:
      'استوديو علامات وتسويق ومنتجات رقمية. اختار خدماتك والفاتورة بتتحسب لحظيًا — بشفافية ومن غير رسوم مخفية.',
    copy: '© 2026 Devya',
    doc: 'عرض سعر · وثيقة خاصة',
    links: {
      devya: 'devya.dev',
      booking: 'احجز اجتماع',
      portfolio: 'أعمالنا',
      contracts: 'العقود',
      quote: 'عرض السعر',
    },
  },
};

const en: MessagesShape = {
  brand: { sub: 'Interactive quote', cta: 'devya.dev' },
  intro: {
    eyebrow: 'Quote builder',
    h1Lead: 'Pick what you need…',
    h1Grad: 'and the invoice updates live',
    paragraph:
      'Transparent, itemised pricing. You pay for the actual deliverables (design, video, content, ads), then a single 20% management layer covers strategy, brand, media buying and consulting. Set the quantities below — the quote and payment schedule update instantly.',
    badges: ['✦ No hidden fees', '📣 100% of the ad budget goes to platforms', '🧾 One flat 20% management fee'],
  },
  services: {
    designs: {
      name: 'Design & creative',
      desc: 'Social posts, ad creative, and visuals — tiered pricing based on volume.',
      hint: 'Up to 15 → 200 EGP each · 16–30 → 170 EGP each · 30+ negotiated (confirmed on a call).',
      unit: 'EGP per design',
    },
    videos: {
      name: 'Video editing',
      desc: 'Reels and ad cuts. Higher volumes get a custom rate.',
      hint: 'Average for ~1-minute videos. We agree a custom rate for larger batches.',
      unit: 'EGP per video (avg.)',
    },
    content: {
      name: 'Content — scripts & strategy',
      desc: 'Monthly content plan and scripts. Scales up with high script volume.',
      toggle: 'Include content plan — flat 2,500 EGP/month',
    },
    ads: {
      name: 'Ad budget',
      desc: 'Paid directly to Meta / Google — 100% yours, we never mark it up.',
      toggle: 'Run paid ads',
      minHint: 'Minimum ad spend is 30,000 EGP/month.',
      overMin: '⚠ Minimum is 30,000 EGP — we’re calculating with the minimum.',
    },
    web: {
      name: 'Websites, apps & systems',
      desc: 'Storefronts, custom builds, and dashboards — scoped together on a call.',
      toggle: 'I need a website / system (on-demand — not part of the monthly)',
      onDemand: 'On demand',
    },
  },
  qtyUnit: {
    designs: 'designs/month',
    videos: 'videos/month',
  },
  invoice: {
    col: '② Monthly invoice',
    kick: 'Your quote',
    mo: 'Estimated monthly value',
    total: 'Monthly total',
    footnoteEstim: 'Figures are estimates and depend on the volumes and budget you confirm.',
    footnoteWeb: '+ Websites/systems: on-demand — scoped and paid separately in milestones (not part of the monthly total).',
    empty: 'Pick at least one service to generate your invoice.',
    save: '🧾 Save / print quote',
    book: 'Book a meeting',
    rowDesigns: 'Designs',
    rowVideos: 'Videos',
    rowContent: 'Content plan',
    rowAds: 'Ad budget',
    rowSubtotal: 'Subtotal',
    rowMgmt: 'Management',
    rowDesignsHint: (q, unit, isSpecial) => `${q} × ${unit}${isSpecial ? ' · negotiated rate' : ''}`,
    rowVideosHint: (q) => `${q} × 350`,
    contentFixedHint: 'Flat / month',
    adsPlatformHint: 'Goes to platforms',
    mgmtHint: '20% on total monthly spend',
    sectionEyebrow: '① Pick services & volumes',
    aside: '② Monthly invoice',
    webOnDemand: 'On demand',
  },
  payRows: {
    eyebrow: 'Payment schedule',
    h2: 'When each line item gets paid.',
    lead: 'So everything is clear from day one — here’s the payment schedule tied to the invoice above.',
    rows: [
      {
        wtag: 'When available',
        small: 'Preferably start of month',
        name: 'Ad budget (100%)',
        desc:
          'Paid when available, ideally at the start of the month so campaigns run without interruption. Goes straight to the platforms (Meta/Google). Minimum 30,000 EGP/month, fully yours — we never mark it up.',
        soft: true,
      },
      {
        wtag: 'Bi-weekly',
        small: 'Or start of month',
        name: 'Content plan & scripts',
        desc:
          'Paid bi-weekly, or at the start of the month — whichever suits you. 2,500 EGP per month for the content plan and scripts.',
      },
      {
        wtag: 'Weekly',
        small: 'End of each week',
        name: 'Designs & videos',
        desc:
          'Billed weekly based on what was actually delivered that week — you pay for finished work in your hands, never up front.',
        soft: true,
      },
      {
        wtag: 'With monthly invoice',
        small: '20%',
        name: 'Management, brand, media buying & consulting',
        desc:
          '20% calculated on the month’s total spend (including ad budget) — one clear number, and we own the outcomes end-to-end.',
      },
      {
        wtag: 'Project milestones',
        small: 'If required',
        name: 'Websites, apps & systems',
        desc:
          'Scoped and paid separately in milestones (e.g. 50% upfront / 50% on delivery) after a scoping call. Not part of the monthly retainer.',
        soft: true,
      },
    ],
  },
  payNotes: [
    '✦ No hidden fees',
    '📣 Ad budget is 100% yours',
    '🧾 Management is a flat 20%',
    '📊 Figures are estimates based on your volumes and budget',
  ],
  footer: {
    tagline:
      'Branding, marketing, and digital product studio. Pick your services and the invoice calculates live — transparent, with no hidden fees.',
    copy: '© 2026 Devya',
    doc: 'Quote · Private document',
    links: {
      devya: 'devya.dev',
      booking: 'Book a meeting',
      portfolio: 'Our Work',
      contracts: 'Contracts',
      quote: 'Quote',
    },
  },
};

export const MESSAGES: Record<Lang, MessagesShape> = { ar, en };
