'use client';

import React, { useState } from 'react';
import { Listing, Vehicle, VisionAnalysisResult } from '@/types/vehicle';
import {
  FileText,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Save,
  CheckCircle,
  Share2,
  Download,
  Search,
  Tag,
  Plus,
  Trash2,
} from 'lucide-react';

interface ListingEditorProps {
  listing: Listing;
  vehicle: Vehicle;
  onSaveListing: (updated: Listing) => Promise<void>;
  onRegenerateWithAI: () => Promise<void>;
  isGenerating?: boolean;
}

export const ListingEditor: React.FC<ListingEditorProps> = ({
  listing: initialListing,
  vehicle,
  onSaveListing,
  onRegenerateWithAI,
  isGenerating = false,
}) => {
  const [listing, setListing] = useState<Listing>(initialListing);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'marketing' | 'specs' | 'seo'>('marketing');
  const [newHighlight, setNewHighlight] = useState('');

  const handleCopy = () => {
    const text = `${listing.title}\n\n${listing.short_summary}\n\n${listing.marketing_description}\n\nKEY HIGHLIGHTS:\n${listing.key_highlights.map((h) => `• ${h}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveListing(listing);
    } finally {
      setIsSaving(false);
    }
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setListing({
      ...listing,
      key_highlights: [...listing.key_highlights, newHighlight.trim()],
    });
    setNewHighlight('');
  };

  const removeHighlight = (idx: number) => {
    setListing({
      ...listing,
      key_highlights: listing.key_highlights.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="rounded-md border border-charcoal-200 bg-white p-5 shadow-sm">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-charcoal-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-charcoal-900 text-white">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-charcoal-900">Merchandising Listing Copy</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                listing.status === 'published'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {listing.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-charcoal-500">
              Verified commercial marketing copy optimized for consumer search
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRegenerateWithAI}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-charcoal-300 hover:bg-charcoal-50 text-xs font-medium text-charcoal-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Regenerating...' : 'Regenerate with AI'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-charcoal-300 hover:bg-charcoal-50 text-xs font-medium text-charcoal-700 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-charcoal-900 text-white text-xs font-semibold hover:bg-charcoal-800 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Listing'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-charcoal-200 mt-4">
        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'marketing'
              ? 'border-charcoal-900 text-charcoal-900'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          Marketing Presentation & Copy
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'specs'
              ? 'border-charcoal-900 text-charcoal-900'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          Structured Feature Specs
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'seo'
              ? 'border-charcoal-900 text-charcoal-900'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          SEO & Search Metadata
        </button>
      </div>

      {/* Tab 1: Marketing Copy */}
      {activeTab === 'marketing' && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-800 mb-1">Listing Headline Title</label>
            <input
              type="text"
              value={listing.title}
              onChange={(e) => setListing({ ...listing, title: e.target.value })}
              className="w-full text-sm font-semibold text-charcoal-900 border border-charcoal-200 rounded px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-800 mb-1">
              Short Summary / Inventory Hook
            </label>
            <textarea
              rows={2}
              value={listing.short_summary}
              onChange={(e) => setListing({ ...listing, short_summary: e.target.value })}
              className="w-full text-xs text-charcoal-800 border border-charcoal-200 rounded px-3 py-2 bg-white leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-800 mb-1">
              Key Marketing Highlights (Bullet Points)
            </label>
            <div className="space-y-1.5 mb-2">
              {listing.key_highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-studio-accent font-bold">•</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...listing.key_highlights];
                      updated[idx] = e.target.value;
                      setListing({ ...listing, key_highlights: updated });
                    }}
                    className="flex-1 text-xs text-charcoal-800 border border-charcoal-200 rounded px-2.5 py-1 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    className="p-1 text-charcoal-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom selling proposition..."
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                className="flex-1 text-xs border border-charcoal-200 rounded px-2.5 py-1 bg-white"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="flex items-center gap-1 px-3 py-1 bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-800 text-xs font-medium rounded"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-800 mb-1">
              Full Dealer Marketing Description
            </label>
            <textarea
              rows={7}
              value={listing.marketing_description}
              onChange={(e) => setListing({ ...listing, marketing_description: e.target.value })}
              className="w-full text-xs text-charcoal-800 border border-charcoal-200 rounded px-3 py-2.5 bg-white leading-relaxed font-sans"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Structured Specs */}
      {activeTab === 'specs' && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded border border-charcoal-100 bg-charcoal-50/50">
            <span className="text-xs font-semibold text-charcoal-900 block mb-2">Powertrain & Performance</span>
            <ul className="space-y-1">
              {(listing.feature_summary.performance || []).map((feat, i) => (
                <li key={i} className="text-xs text-charcoal-700 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-charcoal-400" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded border border-charcoal-100 bg-charcoal-50/50">
            <span className="text-xs font-semibold text-charcoal-900 block mb-2">Exterior & Lighting</span>
            <ul className="space-y-1">
              {(listing.feature_summary.exterior || []).map((feat, i) => (
                <li key={i} className="text-xs text-charcoal-700 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-charcoal-400" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded border border-charcoal-100 bg-charcoal-50/50">
            <span className="text-xs font-semibold text-charcoal-900 block mb-2">Interior Tech & Infotainment</span>
            <ul className="space-y-1">
              {(listing.feature_summary.interior_tech || []).map((feat, i) => (
                <li key={i} className="text-xs text-charcoal-700 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-charcoal-400" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded border border-charcoal-100 bg-charcoal-50/50">
            <span className="text-xs font-semibold text-charcoal-900 block mb-2">Active Safety & Driver Assist</span>
            <ul className="space-y-1">
              {(listing.feature_summary.safety || []).map((feat, i) => (
                <li key={i} className="text-xs text-charcoal-700 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-charcoal-400" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: SEO Metadata */}
      {activeTab === 'seo' && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-charcoal-800">Page Meta Title (SERP Preview)</label>
              <span className="text-[10px] text-charcoal-400 font-mono">
                {listing.seo_title.length} / 65 chars
              </span>
            </div>
            <input
              type="text"
              value={listing.seo_title}
              onChange={(e) => setListing({ ...listing, seo_title: e.target.value })}
              className="w-full text-xs text-charcoal-900 border border-charcoal-200 rounded px-3 py-2 bg-white font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-charcoal-800">SERP Meta Description</label>
              <span className="text-[10px] text-charcoal-400 font-mono">
                {listing.seo_meta_description.length} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={listing.seo_meta_description}
              onChange={(e) => setListing({ ...listing, seo_meta_description: e.target.value })}
              className="w-full text-xs text-charcoal-800 border border-charcoal-200 rounded px-3 py-2 bg-white leading-relaxed font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-800 block mb-1">Target Keyword Phrases</label>
            <div className="flex flex-wrap gap-1.5">
              {listing.seo_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-charcoal-100 text-charcoal-700 text-[11px] font-mono border border-charcoal-200"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

