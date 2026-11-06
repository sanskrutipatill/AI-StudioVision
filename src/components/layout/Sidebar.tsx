'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  Sliders,
  Settings,
  HelpCircle,
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Vehicle Inventory', href: '/vehicles', icon: Car },
  { name: 'Media Gallery', href: '/gallery', icon: ImageIcon },
  { name: 'Listing Manager', href: '/listings', icon: FileText },
  { name: 'Quality Assistant', href: '/quality', icon: CheckCircle2 },
  { name: 'Account & Studio', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-charcoal-200 bg-white min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <div className="text-[11px] font-semibold tracking-wider text-charcoal-400 uppercase px-3 mb-2 font-mono">
          Merchandising Suite
        </div>
        <nav className="space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-charcoal-900 text-white shadow-sm'
                    : 'text-charcoal-600 hover:bg-charcoal-100 hover:text-charcoal-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-charcoal-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-charcoal-200">
        <div className="rounded border border-charcoal-200 bg-charcoal-50 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-charcoal-800 uppercase font-mono">
              Lot Intake Quota
            </span>
            <span className="text-[10px] text-charcoal-500 font-mono">18 / 50</span>
          </div>
          <div className="w-full bg-charcoal-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-charcoal-900 h-full rounded-full" style={{ width: '36%' }} />
          </div>
          <p className="mt-2 text-[10px] text-charcoal-500 leading-normal">
            Tier-1 Studio Processing active. High-resolution exports enabled.
          </p>
        </div>
      </div>
    </aside>
  );
};

