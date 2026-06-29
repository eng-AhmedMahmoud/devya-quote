'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, ExternalLink } from 'lucide-react';
import { DevyaLogo } from './devya-logo';
import { cn } from '@/lib/cn';

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean };

const PRIMARY_NAV: NavItem[] = [
  { href: '/', label: 'Quote builder', icon: Calculator, exact: true },
];

const BACK_TILES: { href: string; label: string }[] = [
  { href: 'https://admin.devya-solutions.com', label: 'Admin dashboard' },
  { href: 'https://contracts.devya-solutions.com', label: 'Contracts' },
  { href: 'https://www.devya.dev', label: 'Marketing site' },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/');

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/5 bg-black/60 backdrop-blur-md no-print">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-white/5">
        <DevyaLogo size={22} />
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-400">
          Quotes
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        <div>
          <div className="px-2 mb-2 text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Overview
          </div>
          <ul className="space-y-0.5">
            {PRIMARY_NAV.map((item) => (
              <NavLink key={item.label} item={item} active={isActive(item)} />
            ))}
          </ul>
        </div>
      </nav>

      <div className="px-3 pb-3 space-y-2">
        {BACK_TILES.map((tile) => (
          <a
            key={tile.href}
            href={tile.href}
            target="_blank"
            rel="noreferrer"
            className="surface block px-3 py-3 hover:border-white/20 transition-colors group"
          >
            <div className="text-[11px] uppercase tracking-wider text-zinc-400">Back to</div>
            <div className="mt-1 flex items-center justify-between text-sm text-white">
              <span>{tile.label}</span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </aside>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ring-focus',
          active
            ? 'bg-white/[0.06] text-white border border-white/10'
            : 'text-zinc-300 hover:text-white hover:bg-white/[0.03] border border-transparent',
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </Link>
    </li>
  );
}
