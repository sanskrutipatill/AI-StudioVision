'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  Image as ImageIcon,
  FileCheck2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Plus,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Building2,
  Calendar,
} from 'lucide-react';
import { Vehicle, Listing } from '@/types/vehicle';
import { VehicleUploadForm } from '@/components/upload/VehicleUploadForm';

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [vehRes, listRes] = await Promise.all([
          fetch('/api/vehicles'),
          fetch('/api/listings'),
        ]);

        if (vehRes.ok) {
          const vehData = await vehRes.json();
          setVehicles(vehData.vehicles || []);
        }

        if (listRes.ok) {
          const listData = await listRes.json();
          setListings(listData.listings || []);
        }
      } catch (e) {
        console.error('Failed to fetch dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const totalProcessedVehicles = vehicles.filter(
    (v) => v.status === 'listing_ready' || v.status === 'published'
  ).length;

  const totalUploadedImages = vehicles.reduce(
    (acc, v) => acc + (v.images_count || 4),
    0
  );

  const completedListings = listings.filter((l) => l.status === 'published').length;
  const pendingApprovals = listings.filter((l) => l.status === 'pending_approval').length;

  // Monthly breakdown mockup analytics
  const monthlyMetrics = [
    { month: 'Jun', count: 32, label: '32 units' },
    { month: 'Jul', count: 44, label: '44 units' },
    { month: 'Aug', count: 58, label: '58 units' },
    { month: 'Sep', count: 71, label: '71 units' },
    { month: 'Oct', count: 89, label: '89 units' },
    { month: 'Nov', count: 104, label: '104 units' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-charcoal-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-charcoal-900">
              Dealership Merchandising Operations
            </h1>
            <span className="rounded bg-charcoal-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-charcoal-700 uppercase">
              Live Fleet
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Automated image enhancement, Gemini Vision QA, and retail listing syndication.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gallery"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded border border-charcoal-300 bg-white hover:bg-charcoal-50 text-xs font-semibold text-charcoal-800 transition-colors shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-studio-accent" />
            <span>Studio Comparison</span>
          </Link>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-charcoal-900 hover:bg-charcoal-800 text-xs font-semibold text-white transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Intake New Vehicle</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded border border-charcoal-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-charcoal-500 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Processed Vehicles
            </span>
            <Car className="h-4 w-4 text-charcoal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-charcoal-900">
              {totalProcessedVehicles}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              +18% MoM
            </span>
          </div>
          <p className="text-[11px] text-charcoal-400 mt-1">
            Standardized with 4K Studio Cyclorama
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded border border-charcoal-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-charcoal-500 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Images Ingested
            </span>
            <ImageIcon className="h-4 w-4 text-charcoal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-charcoal-900">
              {totalUploadedImages}
            </span>
            <span className="text-xs text-charcoal-500 font-mono">
              ~4.8 per unit
            </span>
          </div>
          <p className="text-[11px] text-charcoal-400 mt-1">
            JPG, PNG & WebP high-resolution
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded border border-charcoal-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-charcoal-500 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Completed Listings
            </span>
            <FileCheck2 className="h-4 w-4 text-charcoal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-charcoal-900">
              {completedListings}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              Ready to syndicate
            </span>
          </div>
          <p className="text-[11px] text-charcoal-400 mt-1">
            SEO & commercial specs verified
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded border border-charcoal-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-charcoal-500 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Pending Approvals
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-charcoal-900">
              {pendingApprovals}
            </span>
            <span className="text-xs text-amber-600 font-semibold">
              Awaiting review
            </span>
          </div>
          <p className="text-[11px] text-charcoal-400 mt-1">
            Content and optical QA checks
          </p>
        </div>
      </div>

      {/* Grid: Analytics Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Processing Analytics */}
        <div className="lg:col-span-2 rounded border border-charcoal-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-charcoal-100 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-charcoal-900">
                Monthly Studio Merchandising Volume
              </h3>
              <p className="text-xs text-charcoal-500">
                Vehicles transformed and approved through the AI merchandising pipeline
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-600 font-mono">
              <Calendar className="h-3.5 w-3.5 text-charcoal-400" />
              <span>H2 2026 Fleet Run</span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 flex items-end gap-4 sm:gap-8 pt-4 pb-2 px-2">
            {monthlyMetrics.map((item) => {
              const heightPercent = Math.round((item.count / 110) * 100);
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-charcoal-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                  <div className="w-full bg-charcoal-100 rounded-t overflow-hidden flex items-end h-36">
                    <div
                      className="w-full bg-charcoal-800 group-hover:bg-studio-accent transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-medium text-charcoal-700">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-charcoal-100 flex flex-wrap items-center justify-between text-xs text-charcoal-500">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-charcoal-800" />
              <span>Standard Intake Throughput</span>
            </div>
            <span>Average processing turnaround: <strong>1.4 seconds / frame</strong></span>
          </div>
        </div>

        {/* Right Col: Recent Activity Feed */}
        <div className="rounded border border-charcoal-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-charcoal-100 mb-4">
            <h3 className="text-sm font-semibold text-charcoal-900">
              Live Processing Pipeline
            </h3>
            <span className="text-[10px] font-mono uppercase text-charcoal-400 font-semibold">
              Real-Time
            </span>
          </div>

          <div className="space-y-4">
            {vehicles.slice(0, 5).map((veh) => {
              const statusBadge =
                veh.status === 'published'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : veh.status === 'listing_ready'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-charcoal-100 text-charcoal-700 border-charcoal-200';

              return (
                <Link
                  key={veh.id}
                  href={`/vehicles/${veh.id}`}
                  className="group block p-2.5 rounded border border-charcoal-100 hover:border-charcoal-300 hover:bg-charcoal-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-charcoal-900 group-hover:text-studio-accent transition-colors">
                      {veh.year} {veh.make} {veh.model}
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${statusBadge}`}>
                      {veh.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-charcoal-500">
                    <span className="font-mono">VIN: {veh.vin.substring(0, 11)}...</span>
                    <span>${veh.price.toLocaleString()}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-charcoal-100">
            <Link
              href="/vehicles"
              className="flex items-center justify-between text-xs font-semibold text-charcoal-800 hover:text-studio-accent transition-colors"
            >
              <span>View All Inventory Vehicles</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Upload Vehicle Modal Dialog */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative my-8 max-w-3xl w-full bg-white rounded-md border border-charcoal-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-200 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-charcoal-900">
                  Intake New Vehicle & Photographs
                </h3>
                <p className="text-xs text-charcoal-500">
                  Record vehicle telemetry and upload dealer lot photographs for StudioVision processing
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-charcoal-400 hover:text-charcoal-800 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <VehicleUploadForm
              onSuccess={(newId) => {
                setIsUploadModalOpen(false);
                window.location.href = `/vehicles/${newId}`;
              }}
              onCancel={() => setIsUploadModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

