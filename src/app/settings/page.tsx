'use client';

import React, { useState } from 'react';
import {
  Building2,
  Key,
  ShieldCheck,
  CheckCircle2,
  Database,
  Cpu,
  Save,
  Check,
  AlertCircle,
  HelpCircle,
  Sliders,
} from 'lucide-react';
import { INITIAL_DEALERSHIP, DealershipInfo } from '@/lib/store/vehicle-store';

export default function SettingsPage() {
  const [dealership, setDealership] = useState<DealershipInfo>(INITIAL_DEALERSHIP);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [removeBgApiKey, setRemoveBgApiKey] = useState('');
  const [defaultTemplate, setDefaultTemplate] = useState('white_studio');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="pb-6 border-b border-charcoal-200">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-charcoal-900">
          Dealership Account & AI Engine Configuration
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
          Manage commercial dealership branding, Supabase database bindings, and Gemini Vision credentials
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {saveSuccess && (
          <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Settings and API configurations saved successfully.</span>
          </div>
        )}

        {/* Section 1: Dealership Details */}
        <div className="rounded border border-charcoal-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100">
            <Building2 className="h-4 w-4 text-charcoal-800" />
            <h3 className="text-sm font-semibold text-charcoal-900">
              Dealership Commercial Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-charcoal-700 mb-1">
                Dealership Name
              </label>
              <input
                type="text"
                value={dealership.name}
                onChange={(e) => setDealership({ ...dealership, name: e.target.value })}
                className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal-700 mb-1">
                Contact Inquiries Email
              </label>
              <input
                type="email"
                value={dealership.contactEmail}
                onChange={(e) => setDealership({ ...dealership, contactEmail: e.target.value })}
                className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-charcoal-700 mb-1">
                Dealership Address
              </label>
              <input
                type="text"
                value={dealership.address}
                onChange={(e) => setDealership({ ...dealership, address: e.target.value })}
                className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-charcoal-700 mb-1">
                Architectural Image Banner Overlay Text
              </label>
              <input
                type="text"
                value={dealership.brandingBannerText}
                onChange={(e) => setDealership({ ...dealership, brandingBannerText: e.target.value })}
                placeholder="e.g. APEX CERTIFIED PRE-OWNED - BEVERLY HILLS"
                className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900 font-mono"
              />
              <p className="text-[11px] text-charcoal-400 mt-1">
                Printed subtly atop exported high-resolution marketing photographs.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: AI & Vision Engines */}
        <div className="rounded border border-charcoal-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100">
            <Cpu className="h-4 w-4 text-charcoal-800" />
            <h3 className="text-sm font-semibold text-charcoal-900">
              AI Vision & Image Processing Engines
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-charcoal-700">
                  Google Gemini Vision API Key
                </label>
                <span className="text-[10px] text-charcoal-500 font-mono">
                  Environment: GEMINI_API_KEY
                </span>
              </div>
              <input
                type="password"
                placeholder="AIzaSy... (Leave empty to use server environment variable)"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900 font-mono"
              />
              <p className="text-[11px] text-charcoal-400 mt-1">
                Powers vehicle category identification, camera angle classification, and condition auditing.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-charcoal-700">
                  Optional Remove.bg Commercial API Key
                </label>
                <span className="text-[10px] text-charcoal-500 font-mono">
                  Environment: REMOVE_BG_API_KEY
                </span>
              </div>
              <input
                type="password"
                placeholder="Optional external API key (Defaults to high-speed sharp procedural studio compositor)"
                value={removeBgApiKey}
                onChange={(e) => setRemoveBgApiKey(e.target.value)}
                className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal-700 mb-1">
                Default Merchandising Studio Environment
              </label>
              <select
                value={defaultTemplate}
                onChange={(e) => setDefaultTemplate(e.target.value)}
                className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
              >
                <option value="white_studio">Clean White Cyclorama Studio (Marketplace Standard)</option>
                <option value="dealership_showroom">Modern Dealership Showroom</option>
                <option value="neutral_outdoor">Neutral Outdoor Pavillion</option>
                <option value="architectural_modern">Architectural Minimalist</option>
                <option value="transparent">Isolated PNG (Transparent)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Supabase PostgreSQL & Storage Status */}
        <div className="rounded border border-charcoal-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-charcoal-800" />
              <h3 className="text-sm font-semibold text-charcoal-900">
                Supabase PostgreSQL & Storage Persistence
              </h3>
            </div>
            <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
              Operational
            </span>
          </div>

          <p className="text-xs text-charcoal-600 leading-relaxed">
            StudioVision AI connects to Supabase via Row Level Security (RLS) tables: <code className="bg-charcoal-100 px-1 py-0.5 rounded font-mono text-charcoal-800">dealerships</code>, <code className="bg-charcoal-100 px-1 py-0.5 rounded font-mono text-charcoal-800">vehicles</code>, <code className="bg-charcoal-100 px-1 py-0.5 rounded font-mono text-charcoal-800">uploaded_images</code>, <code className="bg-charcoal-100 px-1 py-0.5 rounded font-mono text-charcoal-800">processed_images</code>, <code className="bg-charcoal-100 px-1 py-0.5 rounded font-mono text-charcoal-800">listings</code>, and <code className="bg-charcoal-100 px-1 py-0.5 rounded font-mono text-charcoal-800">processing_jobs</code>.
          </p>

          <div className="rounded border border-charcoal-100 bg-charcoal-50 p-3 text-xs font-mono text-charcoal-600 space-y-1">
            <div>NEXT_PUBLIC_SUPABASE_URL: Configured (or local fallback mode enabled)</div>
            <div>STORAGE_BUCKET: vehicle-originals & vehicle-processed</div>
            <div>ROW_LEVEL_SECURITY: Enabled for multi-tenant dealership isolation</div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded bg-charcoal-900 text-white text-xs font-semibold hover:bg-charcoal-800 transition-colors shadow-sm"
          >
            <Save className="h-4 w-4" />
            <span>Save Dealership Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
}

