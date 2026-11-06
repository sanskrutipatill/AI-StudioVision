'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Archive,
  Download,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  Share2,
} from 'lucide-react';
import { Listing, ListingStatus, Vehicle } from '@/types/vehicle';

export default function ListingsPage() {
  const [listings, setListings] = useState<(Listing & { vehicles?: Vehicle })[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPreview, setSelectedPreview] = useState<Listing | null>(null);

  const fetchListings = async () => {
    try {
      const res = await fetch(`/api/listings${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch (e) {
      console.error('Failed to fetch listings:', e);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      await fetch('/api/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'published' }),
      });
      fetchListings();
    } catch (e) {
      console.error('Approve failed:', e);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await fetch('/api/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'archived' }),
      });
      fetchListings();
    } catch (e) {
      console.error('Archive failed:', e);
    }
  };

  const exportAsJSON = (listing: Listing) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(listing, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `listing-${listing.vehicle_id}.json`;
    a.click();
  };

  const exportAsWindowStickerHTML = (listing: Listing) => {
    const veh = listing.vehicles;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${listing.title} - Dealership Monroney Sticker</title>
        <style>
          body { font-family: -apple-system, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: baseline; }
          h1 { margin: 0; font-size: 24px; }
          .meta { font-family: monospace; font-size: 13px; color: #475569; }
          .specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
          .section { border: 1px solid #cbd5e1; padding: 16px; border-radius: 4px; }
          .section h3 { margin-top: 0; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          ul { padding-left: 20px; font-size: 13px; }
          .description { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 4px; font-size: 13px; white-space: pre-line; }
          .footer { margin-top: 30px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>${listing.title}</h1>
            <div class="meta">VIN: ${veh?.vin || 'VERIFIED'} | STOCK: ${veh?.stock_number || 'APX-2401'}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 22px; font-weight: bold;">$${veh?.price?.toLocaleString() || 'Inquire'}</div>
            <div class="meta">${veh?.mileage?.toLocaleString() || 0} Miles</div>
          </div>
        </div>

        <div class="specs-grid">
          <div class="section">
            <h3>Key Verified Highlights</h3>
            <ul>${listing.key_highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
          </div>
          <div class="section">
            <h3>Safety & Specifications</h3>
            <ul>${(listing.feature_summary.safety || []).map((s) => `<li>${s}</li>`).join('')}</ul>
          </div>
        </div>

        <div class="description">
          <strong>Certified Retail Description:</strong>\n\n${listing.marketing_description}
        </div>

        <div class="footer">
          StudioVision AI Verified Monroney Merchandising Sheet • Generated for Dealership Syndication
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) win.focus();
  };

  const filtered = listings.filter((l) => {
    return (
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.short_summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-charcoal-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-charcoal-900">
            Listing Merchandising Manager
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Review, approve, and syndicate commercial marketing listings across dealer portals
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded border border-charcoal-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search listings by title, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs border border-charcoal-200 rounded pl-9 pr-3 py-1.5 bg-charcoal-50 focus:bg-white text-charcoal-900"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['all', 'draft', 'pending_approval', 'published', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-charcoal-900 text-white shadow-sm'
                  : 'text-charcoal-600 hover:bg-charcoal-100 hover:text-charcoal-900'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table */}
      <div className="rounded border border-charcoal-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-charcoal-200 bg-charcoal-50/75 text-charcoal-500 font-mono text-[11px] uppercase">
                <th className="py-3 px-4 font-semibold">Listing Headline</th>
                <th className="py-3 px-4 font-semibold">SEO Meta & Score</th>
                <th className="py-3 px-4 font-semibold">Approval State</th>
                <th className="py-3 px-4 font-semibold">Created / Updated</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-charcoal-50/50 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <span className="font-semibold text-charcoal-900 block truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-charcoal-500 line-clamp-1 mt-0.5">
                      {item.short_summary}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700 font-bold font-mono text-xs">
                        {item.quality_score}/100
                      </span>
                      <span className="text-[10px] text-charcoal-400 font-mono">
                        {item.seo_keywords.length} keywords
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${
                      item.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.status === 'pending_approval'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-charcoal-100 text-charcoal-700 border-charcoal-200'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-charcoal-400 font-mono text-[11px]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {item.status !== 'published' && (
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors shadow-sm"
                      >
                        <Check className="h-3 w-3" />
                        <span>Approve</span>
                      </button>
                    )}

                    <button
                      onClick={() => exportAsWindowStickerHTML(item)}
                      title="Export Dealer Window Sticker"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded border border-charcoal-200 hover:bg-charcoal-50 text-charcoal-700 text-[11px] transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      <span>Sticker</span>
                    </button>

                    <button
                      onClick={() => exportAsJSON(item)}
                      title="Export JSON"
                      className="inline-flex items-center px-2 py-1 rounded border border-charcoal-200 hover:bg-charcoal-50 text-charcoal-700 text-[11px] transition-colors"
                    >
                      JSON
                    </button>

                    <Link
                      href={`/vehicles/${item.vehicle_id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-charcoal-200 bg-white hover:bg-charcoal-50 text-charcoal-800 text-[11px] font-medium transition-colors"
                    >
                      <span>Edit</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-charcoal-400">
                    No listings found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

