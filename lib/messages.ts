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
    h1Lead: 'اختر ما تحتاجه…',
    h1Grad: 'وتُحسب الفاتورة لحظيًا',
    paragraph:
      'نموذج شفّاف ومبوّب: تدفع مقابل المخرجات الفعلية (تصميم، فيديو، محتوى، إعلانات)، ثم طبقة إدارة واحدة بنسبة 20% تغطّي الاستراتيجية والعلامة والإعلان الرقمي والاستشارات. حدِّد الكميات أدناه — يتحدّث عرض السعر وجدول الدفع فوريًا.',
    badges: ['✦ لا رسوم مخفية', '📣 ميزانية الإعلانات 100% لصالحكم', '🧾 رسوم إدارة واحدة 20%'],
  },
  services: {
    designs: {
      name: 'التصميمات والمحتوى المرئي',
      desc: 'منشورات التواصل الاجتماعي والإعلانات والمرئيات — التسعير متدرّج حسب الكمية.',
      hint: 'حتى ١٥ ← ٢٠٠ ج.م · من ١٦ إلى ٣٠ ← ١٧٠ ج.م · أكثر من ٣٠ سعر مخصّص (يُحدَّد في اجتماع).',
      unit: 'ج.م للتصميم',
    },
    videos: {
      name: 'مونتاج الفيديو',
      desc: 'مونتاج مقاطع الريلز والإعلانات. الكميات الكبيرة بسعر مخصّص.',
      hint: 'متوسط لفيديو مدّته دقيقة. يُتّفق على سعر مخصّص للكميات الكبيرة.',
      unit: 'ج.م للفيديو (متوسط)',
    },
    content: {
      name: 'المحتوى — سكريبتات وخطة',
      desc: 'خطة محتوى شهرية وسكريبتات. يرتفع السعر مع الكميات الكبيرة من السكريبتات.',
      toggle: 'تضمين خطة المحتوى — مبلغ ثابت ٢٬٥٠٠ ج.م/شهر',
    },
    ads: {
      name: 'ميزانية الإعلانات',
      desc: 'تُدفع مباشرةً إلى Meta / Google — ١٠٠٪ لصالحكم، ولا نضيف عليها أي هامش.',
      toggle: 'تفعيل الإعلانات المدفوعة',
      minHint: 'الحدّ الأدنى لميزانية الإعلانات ٣٠٬٠٠٠ ج.م/شهر.',
      overMin: '⚠ الحدّ الأدنى ٣٠٬٠٠٠ ج.م — يُحسب بالحدّ الأدنى.',
    },
    web: {
      name: 'مواقع وتطبيقات وأنظمة',
      desc: 'بناء متاجر، تطوير مخصّص، ولوحات تحكّم — يُحدَّد النطاق معًا في اجتماع.',
      toggle: 'أحتاج موقعًا / نظامًا (حسب الطلب — غير مشمول في الاشتراك الشهري)',
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
    footnoteEstim: 'الأرقام تقديرية وتعتمد على الكميات والميزانية التي تُحدِّدونها.',
    footnoteWeb: '+ مواقع/أنظمة: حسب الطلب — تُسعَّر وتُدفع منفصلةً على دفعات (غير مشمولة في الإجمالي الشهري).',
    empty: 'اختر خدمة واحدة على الأقل لعرض الفاتورة.',
    save: '🧾 احفظ / اطبع العرض',
    book: 'احجز اجتماعًا',
    rowDesigns: 'التصميمات',
    rowVideos: 'الفيديوهات',
    rowContent: 'خطة المحتوى',
    rowAds: 'ميزانية الإعلانات',
    rowSubtotal: 'الإجمالي الفرعي',
    rowMgmt: 'الإدارة',
    rowDesignsHint: (q, unit, isSpecial) => `${q} × ${unit}${isSpecial ? ' · سعر مخصّص' : ''}`,
    rowVideosHint: (q) => `${q} × 350`,
    contentFixedHint: 'ثابت/شهر',
    adsPlatformHint: 'تُحوَّل إلى المنصات',
    mgmtHint: '٢٠٪ على إجمالي المدفوعات',
    sectionEyebrow: '① اختر خدماتك وكمياتها',
    aside: '② الفاتورة الشهرية',
    webOnDemand: 'حسب الطلب',
  },
  payRows: {
    eyebrow: 'مواعيد الدفع',
    h2: 'موعد سداد كل بند.',
    lead: 'لتكون الصورة واضحة من البداية — هذا جدول الدفع المرتبط بالفاتورة أعلاه.',
    rows: [
      {
        wtag: 'حسب التوفّر',
        small: 'يُستحسن بداية الشهر',
        name: 'ميزانية الإعلانات (١٠٠٪)',
        desc:
          'تُدفع حسب التوفّر، ويُستحسن أن تكون في بداية الشهر لضمان استمرار الحملات دون انقطاع. تُحوَّل مباشرةً إلى المنصات (Meta/Google). الحدّ الأدنى ٣٠٬٠٠٠ ج.م/شهر، والمبلغ بالكامل لصالحكم ولا نضيف عليه أي هامش.',
        soft: true,
      },
      {
        wtag: 'كل أسبوعين',
        small: 'أو بداية الشهر',
        name: 'خطة المحتوى والسكريبتات',
        desc:
          'تُدفع كل أسبوعين، أو في بداية الشهر — وفق ما يناسبكم. القيمة ٢٬٥٠٠ ج.م شهريًا مقابل خطة المحتوى والسكريبتات.',
      },
      {
        wtag: 'أسبوعيًا',
        small: 'نهاية كل أسبوع',
        name: 'التصميمات والفيديوهات',
        desc:
          'فوترة أسبوعية وفق ما سُلِّم فعليًا خلال الأسبوع — تدفع مقابل عمل منجز بين يديك، لا مقدّمًا.',
        soft: true,
      },
      {
        wtag: 'مع فاتورة الشهر',
        small: '٢٠٪',
        name: 'الإدارة والعلامة والإعلان الرقمي والاستشارات',
        desc:
          'نسبة ٢٠٪ محسوبة على إجمالي مدفوعات الشهر (بما فيها ميزانية الإعلانات) — رقم واحد واضح، ونحن مسؤولون تمامًا عن النتائج.',
      },
      {
        wtag: 'دفعات المشروع',
        small: 'عند الحاجة',
        name: 'المواقع والتطبيقات والأنظمة',
        desc:
          'تُسعَّر وتُدفع منفصلةً على دفعات حسب مراحل المشروع (مثلًا ٥٠٪ عند البدء / ٥٠٪ عند التسليم) — بعد اجتماع لتحديد النطاق. ليست جزءًا من الاشتراك الشهري.',
        soft: true,
      },
    ],
  },
  payNotes: [
    '✦ لا رسوم مخفية',
    '📣 ميزانية الإعلانات ١٠٠٪ لصالحكم',
    '🧾 الإدارة ٢٠٪ على إجمالي المدفوعات',
    '📊 الأرقام تقديرية وتعتمد على الكميات والميزانية',
  ],
  footer: {
    tagline:
      'استوديو علامات وتسويق ومنتجات رقمية. اختر خدماتك وتُحسب الفاتورة لحظيًا — بشفافية ودون رسوم مخفية.',
    copy: '© 2026 Devya',
    doc: 'عرض سعر · وثيقة خاصة',
    links: {
      devya: 'devya.dev',
      booking: 'احجز اجتماعًا',
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
