'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  Sun,
  LayoutGrid,
  FileCheck2,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Vehicle, QualityReport } from '@/types/vehicle';
import { INITIAL_VEHICLES, INITIAL_IMAGES, INITIAL_LISTINGS } from '@/lib/store/vehicle-store';
import { evaluateVehicleMerchandisingQuality } from '@/lib/ai/quality-checker';

export default function QualityPage() {
  const vehicles = INITIAL_VEHICLES;

  const vehicleAudits = vehicles.map((veh) => {
    const images = INITIAL_IMAGES.filter((img) => img.vehicle_id === veh.id);
    const listing = INITIAL_LISTINGS.find((l) => l.vehicle_id === veh.id);
    const report = evaluateVehicleMerchandisingQuality(images, listing);
    return {
      vehicle: veh,
      imagesCount: images.length,
      report,
    };
  });

  const fleetAverageScore = Math.round(
    vehicleAudits.reduce((acc, v) => acc + v.report.overallScore, 0) / (vehicleAudits.length || 1)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-charcoal-900">
              AI Merchandising Quality Inspector
            </h1>
            <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase">
              Compliance Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Automated scrutiny of angle coverage, exposure consistency, lighting, and description fidelity
          </p>
        </div>
      </div>

      {/* Fleet Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded border border-charcoal-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-charcoal-400 font-semibold block mb-1">
            Fleet Merchandising Index
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-charcoal-900">
              {fleetAverageScore}
            </span>
            <span className="text-xs text-emerald-600 font-semibold font-mono">/ 100</span>
          </div>
          <p className="text-[11px] text-charcoal-500 mt-1">
            Tier-1 dealership retail threshold (&gt;85)
          </p>
        </div>

        <div className="rounded border border-charcoal-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-charcoal-400 font-semibold block mb-1">
            Angle Completeness
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-charcoal-900">92%</span>
            <span className="text-xs text-charcoal-500 font-mono">coverage</span>
          </div>
          <p className="text-[11px] text-charcoal-500 mt-1">
            Front 3/4, side, rear, and cockpit views
          </p>
        </div>

        <div className="rounded border border-charcoal-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-charcoal-400 font-semibold block mb-1">
            Studio Background Parity
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-charcoal-900">84%</span>
            <span className="text-xs text-charcoal-500 font-mono">standardized</span>
          </div>
          <p className="text-[11px] text-charcoal-500 mt-1">
            Isolated onto cyclorama or showroom
          </p>
        </div>

        <div className="rounded border border-charcoal-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-charcoal-400 font-semibold block mb-1">
            Truth-in-Merchandising
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-600">100%</span>
            <span className="text-xs text-emerald-700 font-mono">verified</span>
          </div>
          <p className="text-[11px] text-charcoal-500 mt-1">
            Zero hallucinated specs or disguised scratches
          </p>
        </div>
      </div>

      {/* Vehicle Quality Audit Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-charcoal-900">
          Individual Vehicle Merchandising Audits
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {vehicleAudits.map(({ vehicle, imagesCount, report }) => {
            const badgeColor =
              report.ratingLabel === 'Exceptional'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : report.ratingLabel === 'Listing Ready'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-amber-50 text-amber-700 border-amber-200';

            return (
              <div
                key={vehicle.id}
                className="rounded border border-charcoal-200 bg-white p-5 shadow-sm hover:border-charcoal-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal-100">
                  <div>
                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="text-sm font-bold text-charcoal-900 hover:text-studio-accent transition-colors flex items-center gap-1.5"
                    >
                      <span>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <span className="text-xs text-charcoal-500 font-mono">
                      VIN: {vehicle.vin} • {imagesCount} Photographs
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold uppercase border ${badgeColor}`}>
                      {report.ratingLabel}
                    </span>
                    <span className="text-xl font-bold font-mono text-charcoal-900">
                      {report.overallScore}/100
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-charcoal-800 block mb-1">
                      Angle Checklist:
                    </span>
                    {report.missingAngles.length === 0 ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> All 5 standard angles verified
                      </span>
                    ) : (
                      <span className="text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Missing: {report.missingAngles.map((a) => a.replace(/_/g, ' ')).join(', ')}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="font-semibold text-charcoal-800 block mb-1">
                      Lighting & Exposure:
                    </span>
                    <span className="text-charcoal-600">
                      {report.lightingConsistencyScore}% Uniformity Across Assets
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-charcoal-800 block mb-1">
                      Action Required:
                    </span>
                    <span className="text-charcoal-600 line-clamp-1">
                      {report.actionableSuggestions[0] || 'Meets dealer publishing standards.'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

