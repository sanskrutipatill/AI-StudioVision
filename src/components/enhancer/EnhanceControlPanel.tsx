'use client';

import React, { useState } from 'react';
import { BackgroundTemplateId } from '@/types/vehicle';
import { BACKGROUND_TEMPLATES } from '@/lib/image-processing/background-templates';
import { Sparkles, Sliders, Check, Loader2, Download, ShieldCheck, Info } from 'lucide-react';

interface EnhanceControlPanelProps {
  onProcessImage: (options: {
    templateId: BackgroundTemplateId;
    dealershipName?: string;
    bannerText?: string;
    normalizeLighting: boolean;
  }) => Promise<void>;
  isProcessing: boolean;
  defaultTemplate?: BackgroundTemplateId;
  defaultBannerText?: string;
  hasProcessedResult?: boolean;
  onDownloadProcessed?: () => void;
}

export const EnhanceControlPanel: React.FC<EnhanceControlPanelProps> = ({
  onProcessImage,
  isProcessing,
  defaultTemplate = 'white_studio',
  defaultBannerText = 'VERIFIED CERTIFIED PRE-OWNED',
  hasProcessedResult = false,
  onDownloadProcessed,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<BackgroundTemplateId>(defaultTemplate);
  const [bannerText, setBannerText] = useState(defaultBannerText);
  const [includeBanner, setIncludeBanner] = useState(false);
  const [normalizeLighting, setNormalizeLighting] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onProcessImage({
      templateId: selectedTemplate,
      bannerText: includeBanner ? bannerText : undefined,
      normalizeLighting,
    });
  };

  return (
    <div className="rounded-md border border-charcoal-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-charcoal-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-charcoal-900 text-white">
            <Sparkles className="h-4 w-4 text-studio-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-charcoal-900">Studio Backdrop & Optical Processing</h3>
            <p className="text-xs text-charcoal-500">
              Commercial vehicle background replacement & 4K merchandising normalization
            </p>
          </div>
        </div>

        {hasProcessedResult && onDownloadProcessed && (
          <button
            type="button"
            onClick={onDownloadProcessed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-charcoal-900 text-white text-xs font-medium hover:bg-charcoal-800 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download High-Res 4K</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Background Environment Selector */}
        <div>
          <label className="text-xs font-semibold text-charcoal-800 block mb-2">
            Select Merchandising Environment:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {BACKGROUND_TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;

              return (
                <button
                  type="button"
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`text-left p-3 rounded border transition-all ${
                    isSelected
                      ? 'border-charcoal-900 bg-charcoal-50 ring-1 ring-charcoal-900'
                      : 'border-charcoal-200 hover:border-charcoal-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-charcoal-900">{tpl.name}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-charcoal-900 font-bold" />}
                  </div>
                  <p className="text-[11px] text-charcoal-500 line-clamp-2 leading-tight">
                    {tpl.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Options & Safeguards */}
        <div className="rounded border border-charcoal-100 bg-charcoal-50/60 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="normLighting"
                checked={normalizeLighting}
                onChange={(e) => setNormalizeLighting(e.target.checked)}
                className="h-4 w-4 rounded border-charcoal-300 text-charcoal-900 focus:ring-charcoal-900"
              />
              <label htmlFor="normLighting" className="text-xs font-medium text-charcoal-700 cursor-pointer">
                Non-Destructive Daylight Balance (5500K Color Calibration)
              </label>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Paint Veracity Safe
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeBanner"
                checked={includeBanner}
                onChange={(e) => setIncludeBanner(e.target.checked)}
                className="h-4 w-4 rounded border-charcoal-300 text-charcoal-900 focus:ring-charcoal-900"
              />
              <label htmlFor="includeBanner" className="text-xs font-medium text-charcoal-700 cursor-pointer">
                Include Dealership Architectural Top Ribbon
              </label>
            </div>
          </div>

          {includeBanner && (
            <div className="pl-6 pt-1">
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="e.g. APEX CERTIFIED PRE-OWNED - BEVERLY HILLS"
                className="w-full text-xs border border-charcoal-200 rounded px-2.5 py-1.5 bg-white text-charcoal-900 font-mono"
              />
            </div>
          )}
        </div>

        {/* Truth in Merchandising notice */}
        <div className="flex items-start gap-2 p-2.5 rounded bg-blue-50/50 border border-blue-100 text-xs text-blue-900">
          <ShieldCheck className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-[11px] leading-relaxed">
            <strong>Merchandising Compliance:</strong> StudioVision AI isolates background environments and renders physical contact tire shadows. The original vehicle body panels, trim badges, and observable conditions are strictly preserved without deceptive alteration.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isProcessing}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-charcoal-900 text-white text-xs font-semibold hover:bg-charcoal-800 disabled:opacity-50 transition-colors shadow-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-studio-accent" />
                <span>Processing 4K Studio Image...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-studio-accent" />
                <span>Apply Studio Backdrop</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

