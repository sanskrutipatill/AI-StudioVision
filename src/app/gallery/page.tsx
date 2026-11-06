'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Eye,
  Sliders,
  Filter,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { ImageComparisonSlider } from '@/components/media/ImageComparisonSlider';
import { LightboxModal } from '@/components/media/LightboxModal';
import { INITIAL_IMAGES, INITIAL_PROCESSED_IMAGES } from '@/lib/store/vehicle-store';
import { UploadedImage, ProcessedImage } from '@/types/vehicle';

export default function GalleryPage() {
  const [filterType, setFilterType] = useState<'all' | 'processed' | 'original'>('all');
  const [selectedComparisonPair, setSelectedComparisonPair] = useState<{
    original: string;
    processed: string;
    title: string;
  }>({
    original: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
    processed: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
    title: 'Porsche Taycan 4S – Front Three-Quarter (White Cyclorama Studio)',
  });

  const [lightboxData, setLightboxData] = useState<{ url: string; title: string } | null>(null);

  const images = INITIAL_IMAGES;
  const processed = INITIAL_PROCESSED_IMAGES;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-charcoal-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-charcoal-900">
            Automotive Media Asset Hub
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Compare dealer lot intake photographs against StudioVision AI isolated 4K renders
          </p>
        </div>
      </div>

      {/* Featured Interactive Comparison Slider Section */}
      <div className="rounded border border-charcoal-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-charcoal-900 text-white">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-charcoal-900">
                Interactive Before / After Studio Evaluation
              </h3>
              <p className="text-xs text-charcoal-500">
                {selectedComparisonPair.title}
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setLightboxData({
                url: selectedComparisonPair.processed,
                title: selectedComparisonPair.title,
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-charcoal-200 hover:bg-charcoal-50 text-xs font-semibold text-charcoal-800 transition-colors shadow-sm"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>Full-Screen Lightbox</span>
          </button>
        </div>

        <div className="max-w-5xl mx-auto">
          <ImageComparisonSlider
            originalUrl={selectedComparisonPair.original}
            processedUrl={selectedComparisonPair.processed}
            originalLabel="Raw Intake (Dealership Lot)"
            processedLabel="StudioVision 4K Cyclorama"
          />
        </div>
      </div>

      {/* Media Assets Gallery Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-charcoal-900">
            Catalogued Asset Library ({images.length + processed.length} assets)
          </h3>

          <div className="flex items-center gap-1">
            {(['all', 'processed', 'original'] as const).map((ft) => (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${
                  filterType === ft
                    ? 'bg-charcoal-900 text-white shadow-sm'
                    : 'text-charcoal-600 hover:bg-charcoal-100'
                }`}
              >
                {ft === 'processed' ? 'Studio Enhanced (4K)' : ft === 'original' ? 'Intake Originals' : 'All Media'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => {
            const proc = processed.find((p) => p.original_image_id === img.id);

            if (filterType === 'processed' && !proc) return null;

            return (
              <div
                key={img.id}
                className="rounded border border-charcoal-200 bg-white overflow-hidden shadow-sm flex flex-col group"
              >
                <div
                  onClick={() =>
                    setSelectedComparisonPair({
                      original: img.file_path,
                      processed: proc?.processed_file_path || img.file_path,
                      title: `${img.angle_label.replace(/_/g, ' ').toUpperCase()} Perspective`,
                    })
                  }
                  className="relative aspect-[16/9] w-full bg-charcoal-100 cursor-pointer overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proc?.processed_file_path || img.file_path}
                    alt={img.file_name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />

                  <span className="absolute top-2 left-2 rounded bg-charcoal-900/80 backdrop-blur px-2 py-0.5 text-[10px] text-white font-mono uppercase">
                    {proc ? 'Studio 4K' : 'Original Intake'}
                  </span>

                  <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white capitalize">
                    {img.angle_label.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-3 flex items-center justify-between text-xs border-t border-charcoal-100 mt-auto">
                  <div className="flex flex-col">
                    <span className="font-semibold text-charcoal-900 truncate max-w-[140px]">
                      {img.file_name}
                    </span>
                    <span className="text-[10px] text-charcoal-400 font-mono">
                      {(img.file_size_bytes / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setLightboxData({
                          url: proc?.processed_file_path || img.file_path,
                          title: img.file_name,
                        })
                      }
                      className="p-1.5 rounded hover:bg-charcoal-100 text-charcoal-500"
                      title="Inspect"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={proc?.processed_file_path || img.file_path}
                      download={img.file_name}
                      className="p-1.5 rounded hover:bg-charcoal-100 text-charcoal-500"
                      title="Download"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxData && (
        <LightboxModal
          isOpen={Boolean(lightboxData)}
          onClose={() => setLightboxData(null)}
          imageUrl={lightboxData.url}
          title={lightboxData.title}
          subtitle="StudioVision AI Enterprise 4K Render"
        />
      )}
    </div>
  );
}

