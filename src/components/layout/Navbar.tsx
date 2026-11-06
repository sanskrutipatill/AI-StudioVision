'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Building2, User, Bell, ChevronRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  dealershipName?: string;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  dealershipName = 'Apex Motor Group',
  userName = 'Alex Mercer',
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-charcoal-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Branding */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded border border-charcoal-800 bg-charcoal-900 text-white transition-colors group-hover:bg-charcoal-800">
              <Camera className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wider text-charcoal-900 uppercase">
                StudioVision<span className="text-studio-accent font-mono ml-1">AI</span>
              </span>
              <span className="text-[10px] font-medium tracking-tight text-charcoal-500 uppercase">
                Vehicle Merchandising Engine
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center text-xs text-charcoal-400">
            <ChevronRight className="h-3.5 w-3.5 mx-2" />
            <div className="flex items-center gap-1.5 text-charcoal-700 font-medium">
              <Building2 className="h-3.5 w-3.5 text-charcoal-500" />
              <span>{dealershipName}</span>
            </div>
          </div>
        </div>

        {/* Right Status & Profile */}
        <div className="flex items-center gap-4">
          {/* Status pill */}
          <div className="hidden sm:flex items-center gap-2 rounded border border-charcoal-200 bg-charcoal-50 px-2.5 py-1 text-xs text-charcoal-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] font-medium">API ENGINE ACTIVE</span>
          </div>

          <div className="h-4 w-px bg-charcoal-200" />

          {/* User badge */}
          <Link
            href="/settings"
            className="flex items-center gap-2.5 rounded border border-transparent p-1.5 hover:border-charcoal-200 hover:bg-charcoal-50 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-100 text-charcoal-700 border border-charcoal-200">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-charcoal-900 leading-tight">{userName}</span>
              <span className="text-[10px] text-charcoal-500 leading-tight">Merchandising Lead</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

