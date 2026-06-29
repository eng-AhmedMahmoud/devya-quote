import type { Lang } from '@/lib/messages';
import { MESSAGES } from '@/lib/messages';
import { DevyaMark } from '@/components/ui/devya-logo';

interface Props {
  lang: Lang;
}

export function FooterBlock({ lang }: Props) {
  const t = MESSAGES[lang].footer;
  return (
    <footer className="bg-black/40 border-t border-white/10 py-10 mt-2">
      <div className="container mx-auto px-5 sm:px-8 max-w-[1180px]">
        <div className="flex flex-wrap justify-between gap-6 items-start">
          <div className="max-w-[46ch]">
            <div className="flex items-center gap-2 mb-3">
              <DevyaMark size={24} className="text-white" />
              <span className="font-sora font-semibold tracking-[0.18em] text-white text-base uppercase">
                Devya
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{t.tagline}</p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-300">
            <a
              href="https://devya.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:text-white transition"
            >
              {t.links.devya}
            </a>
            <a
              href="https://booking.devya-solutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              {t.links.booking}
            </a>
            <a
              href="https://devya.dev#work"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              {t.links.portfolio}
            </a>
            <a
              href="https://contracts.devya-solutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              {t.links.contracts}
            </a>
            <a href="#" className="hover:text-white transition">
              {t.links.quote}
            </a>
          </nav>
        </div>
        <div className="mt-5 pt-4 border-t border-white/5 text-xs text-zinc-500 font-mono flex flex-wrap gap-3 justify-between">
          <span>{t.copy}</span>
          <span>{t.doc}</span>
        </div>
      </div>
    </footer>
  );
}
