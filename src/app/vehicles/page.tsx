'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  Search,
  Filter,
  Plus,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Camera,
  CheckCircle2,
  Clock,
  Archive,
} from 'lucide-react';
import { Vehicle, VehicleStatus } from '@/types/vehicle';
import { VehicleUploadForm } from '@/components/upload/VehicleUploadForm';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const res = await fetch('/api/vehicles');
        if (res.ok) {
          const data = await res.json();
          setVehicles(data.vehicles || []);
        }
      } catch (e) {
        console.error('Failed to load vehicles:', e);
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, []);

  const filtered = vehicles.filter((v) => {
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const matchesSearch =
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.stock_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'listing_ready':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'enhancing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'analyzing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'intake':
      default:
        return 'bg-charcoal-100 text-charcoal-700 border-charcoal-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-charcoal-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-charcoal-900">
            Vehicle Merchandising Fleet
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Manage intake photographs, studio enhancements, and live listing readiness
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded bg-charcoal-900 hover:bg-charcoal-800 text-xs font-semibold text-white transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Intake New Vehicle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded border border-charcoal-200 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search by Make, Model, VIN, Stock #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs border border-charcoal-200 rounded pl-9 pr-3 py-1.5 bg-charcoal-50 focus:bg-white text-charcoal-900"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['all', 'intake', 'analyzing', 'enhancing', 'listing_ready', 'published'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                filterStatus === st
                  ? 'bg-charcoal-900 text-white shadow-sm'
                  : 'text-charcoal-600 hover:bg-charcoal-100 hover:text-charcoal-900'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded border border-charcoal-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-charcoal-200 bg-charcoal-50/75 text-charcoal-500 font-mono text-[11px] uppercase">
                <th className="py-3 px-4 font-semibold">Vehicle Specs</th>
                <th className="py-3 px-4 font-semibold">VIN & Stock</th>
                <th className="py-3 px-4 font-semibold">Odometer / Price</th>
                <th className="py-3 px-4 font-semibold">Asset Status</th>
                <th className="py-3 px-4 font-semibold">Workflow Stage</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-700">
              {filtered.map((veh) => (
                <tr key={veh.id} className="hover:bg-charcoal-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/vehicles/${veh.id}`}
                      className="font-semibold text-charcoal-900 hover:text-studio-accent transition-colors flex items-center gap-1.5"
                    >
                      <span>
                        {veh.year} {veh.make} {veh.model}
                      </span>
                    </Link>
                    <span className="text-[11px] text-charcoal-400 block">
                      {veh.trim || veh.body_type} • {veh.exterior_color}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-charcoal-600">
                    <div>{veh.vin}</div>
                    <div className="text-[10px] text-charcoal-400">Stock: {veh.stock_number}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-charcoal-900 font-mono">
                      ${veh.price.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-charcoal-500 font-mono">
                      {veh.mileage.toLocaleString()} mi
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[11px] text-charcoal-600">
                        <Camera className="h-3 w-3 text-charcoal-400" />
                        <span>{veh.images_count || 4} intake</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-charcoal-600">
                        <Sparkles className="h-3 w-3 text-studio-accent" />
                        <span>{veh.processed_count || 2} studio</span>
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${getStatusBadge(veh.status)}`}>
                      {veh.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/vehicles/${veh.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-charcoal-200 bg-white hover:bg-charcoal-50 text-charcoal-800 text-xs font-medium transition-colors"
                    >
                      <span>Open Studio</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal-400">
                    No vehicles found matching current search or status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative my-8 max-w-3xl w-full bg-white rounded-md border border-charcoal-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-charcoal-900">
                  Intake New Vehicle & Photographs
                </h3>
                <p className="text-xs text-charcoal-500">
                  Record vehicle details and upload lot photographs
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

