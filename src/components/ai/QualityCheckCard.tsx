'use client';

import React from 'react';
import { QualityReport } from '@/types/vehicle';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Camera,
  Sun,
  LayoutGrid,
  FileCheck,
  ChevronRight,
} from 'lucide-react';

interface QualityCheckCardProps {
  report: QualityReport;
  onAutoFixTrigger?: () => void;
}

export const QualityCheckCard: React.FC<QualityCheckCardProps> = ({
  report,
  onAutoFixTrigger,
}) => {
  const getBadgeColor = (label: QualityReport['rating_label']) => {
    switch (label) {
      case 'Exceptional':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Listing Ready':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Needs Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Incomplete':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="rounded-md border border-charcoal-200 bg-white p-5 shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-charcoal-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-charcoal-900 text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-charcoal-900">Merchandising Quality Audit</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${getBadgeColor(report.ratingLabel)}`}>
                {report.ratingLabel}
              </span>
            </div>
            <p className="text-xs text-charcoal-500">
              Automated audit evaluating marketplace syndication compliance
            </p>
          </div>
        </div>

        {/* Big Score Gauge */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono text-charcoal-900">
            {report.overallScore}
          </span>
          <span className="text-xs font-mono text-charcoal-400">/100</span>
        </div>
      </div>

      {/* 4 Pillars Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* Angle Coverage */}
        <div className="rounded border border-charcoal-100 bg-charcoal-50/50 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-charcoal-500 font-semibold">
              Angles Covered
            </span>
            <Camera className="h-3.5 w-3.5 text-charcoal-400" />
          </div>
          <span className="text-xs font-bold text-charcoal-900">
            {report.missingAngles.length === 0 ? '5 / 5 (Complete)' : `${5 - report.missingAngles.length} / 5 angles`}
          </span>
        </div>

        {/* Lighting Consistency */}
        <div className="rounded border border-charcoal-100 bg-charcoal-50/50 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-charcoal-500 font-semibold">
              Lighting Uniformity
            </span>
            <Sun className="h-3.5 w-3.5 text-charcoal-400" />
          </div>
          <span className="text-xs font-bold text-charcoal-900 font-mono">
            {report.lightingConsistencyScore}% Uniform
          </span>
        </div>

        {/* Background Uniformity */}
        <div className="rounded border border-charcoal-100 bg-charcoal-50/50 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-charcoal-500 font-semibold">
              Studio Backdrop
            </span>
            <LayoutGrid className="h-3.5 w-3.5 text-charcoal-400" />
          </div>
          <span className="text-xs font-bold text-charcoal-900 font-mono">
            {Math.round(report.backgroundStandardizationRatio * 100)}% Standardized
          </span>
        </div>

        {/* Resolution Check */}
        <div className="rounded border border-charcoal-100 bg-charcoal-50/50 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-charcoal-500 font-semibold">
              Optical Clarity
            </span>
            <FileCheck className="h-3.5 w-3.5 text-charcoal-400" />
          </div>
          <span className={`text-xs font-bold ${
            report.resolutionCheck === 'Passed' ? 'text-emerald-600' : 'text-amber-600'
          }`}>
            {report.resolutionCheck}
          </span>
        </div>
      </div>

      {/* Actionable Suggestions */}
      <div className="rounded border border-charcoal-100 bg-charcoal-50 p-3.5">
        <span className="text-xs font-semibold text-charcoal-800 block mb-2 font-mono uppercase tracking-tight">
          Actionable Recommendations ({report.actionableSuggestions.length}):
        </span>

        <ul className="space-y-2">
          {report.actionableSuggestions.map((sugg, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-charcoal-700 leading-snug">
              <span className="h-1.5 w-1.5 rounded-full bg-studio-accent mt-1.5 shrink-0" />
              <span>{sugg}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

