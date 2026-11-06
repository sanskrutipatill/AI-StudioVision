'use client';

import React, { useState, useRef, useCallback } from 'react';
import { SlidersHorizontal, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ImageComparisonSliderProps {
  originalUrl: string;
  processedUrl: string;
  originalLabel?: string;
  processedLabel?: string;
  aspectRatio?: string; // e.g. "aspect-[16/9]"
  className?: string;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  originalUrl,
  processedUrl,
  originalLabel = 'Original Intake Photo',
  processedLabel = 'StudioVision Enhanced (Clean White Studio)',
  aspectRatio = 'aspect-[16/9]',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(clamped);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      className={`relative select-none overflow-hidden rounded-md border border-charcoal-200 bg-charcoal-100 cursor-ew-resize ${aspectRatio} ${className}`}
    >
      {/* Background Layer: Processed Enhanced Studio Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={processedUrl}
        alt="Studio Enhanced"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Foreground Layer: Original Intake Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={originalUrl}
          alt="Original Intake"
          className="absolute inset-0 h-full w-full object-cover max-w-none"
          style={{
            width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
          }}
          draggable={false}
        />
      </div>

      {/* Vertical Slider Handle Line */}
      <div
        className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-charcoal-300 bg-white shadow-md text-charcoal-800 transition-transform hover:scale-105">
          <SlidersHorizontal className="h-3.5 w-3.5 rotate-90" />
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded bg-charcoal-900/80 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-white border border-charcoal-700">
        <ImageIcon className="h-3 w-3 text-charcoal-300" />
        <span>{originalLabel}</span>
      </div>

      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded bg-charcoal-900/80 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-white border border-charcoal-700">
        <Sparkles className="h-3 w-3 text-studio-accent" />
        <span>{processedLabel}</span>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 rounded bg-charcoal-900/60 backdrop-blur px-2 py-0.5 text-[10px] text-charcoal-200 pointer-events-none">
        Drag slider horizontally to inspect background isolation & lighting
      </div>
    </div>
  );
};

