'use client';

import React, { useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut, Maximize2, ShieldCheck } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  subtitle?: string;
  metadata?: {
    angle?: string;
    quality?: number;
    dimensions?: string;
    fileSize?: string;
  };
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
  metadata,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `studiovision-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/90 backdrop-blur-sm p-4 sm:p-6">
      <div className="relative flex flex-col max-w-6xl w-full h-[90vh] bg-charcoal-900 border border-charcoal-700 rounded-md overflow-hidden shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-charcoal-800 bg-charcoal-900 text-white">
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold tracking-wide text-white">{title}</h3>
            {subtitle && <p className="text-xs text-charcoal-400">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-charcoal-800 hover:bg-charcoal-700 text-xs font-medium text-white transition-colors border border-charcoal-700"
            >
              <Download className="h-3.5 w-3.5 text-charcoal-300" />
              <span>Download Asset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-charcoal-800 text-charcoal-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Image Preview Canvas */}
        <div className="relative flex-1 flex items-center justify-center p-6 bg-charcoal-950 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="max-h-full max-w-full object-contain drop-shadow-2xl rounded"
          />
        </div>

        {/* Footer Technical Metadata */}
        {metadata && (
          <div className="flex flex-wrap items-center justify-between px-5 py-2.5 border-t border-charcoal-800 bg-charcoal-900 text-xs text-charcoal-400">
            <div className="flex items-center gap-5">
              {metadata.angle && (
                <span>
                  Angle: <strong className="text-white capitalize">{metadata.angle.replace(/_/g, ' ')}</strong>
                </span>
              )}
              {metadata.dimensions && (
                <span>
                  Resolution: <strong className="text-white">{metadata.dimensions}</strong>
                </span>
              )}
              {metadata.fileSize && (
                <span>
                  Size: <strong className="text-white">{metadata.fileSize}</strong>
                </span>
              )}
            </div>

            {metadata.quality !== undefined && (
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  Vision Score: <strong className="text-emerald-400">{metadata.quality}/100</strong>
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

