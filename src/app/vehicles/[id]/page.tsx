'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  Sparkles,
  Camera,
  FileText,
  ShieldCheck,
  ImageIcon,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  ExternalLink,
  Share2,
} from 'lucide-react';
import {
  Vehicle,
  UploadedImage,
  ProcessedImage,
  Listing,
  QualityReport,
  BackgroundTemplateId,
  VisionAnalysisResult,
} from '@/types/vehicle';
import { ImageComparisonSlider } from '@/components/media/ImageComparisonSlider';
import { EnhanceControlPanel } from '@/components/enhancer/EnhanceControlPanel';
import { VisionAnalysisCard } from '@/components/ai/VisionAnalysisCard';
import { ListingEditor } from '@/components/listings/ListingEditor';
import { QualityCheckCard } from '@/components/ai/QualityCheckCard';
import { LightboxModal } from '@/components/media/LightboxModal';

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const routeParams = useParams();
  const vehicleId = (routeParams?.id as string) || '';

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [listing, setListing] = useState<Listing | null>(null);
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);

  const [activeTab, setActiveTab] = useState<'enhancer' | 'vision' | 'listing' | 'quality' | 'gallery'>('enhancer');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isProcessingEnhance, setIsProcessingEnhance] = useState<boolean>(false);
  const [isGeneratingListing, setIsGeneratingListing] = useState<boolean>(false);
  const [isAnalyzingVision, setIsAnalyzingVision] = useState<boolean>(false);
  const [lightboxData, setLightboxData] = useState<{ url: string; title: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load Vehicle Data
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`);
      if (res.ok) {
        const data = await res.json();
        setVehicle(data.vehicle);
        setUploadedImages(data.uploadedImages || []);
        setProcessedImages(data.processedImages || []);
        setListing(data.listing);
        setQualityReport(data.qualityReport);
      }
    } catch (e) {
      console.error('Error fetching vehicle details:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-xs font-mono text-charcoal-500">
        Loading StudioVision workspace for {vehicleId}...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-base font-bold text-charcoal-900">Vehicle Not Found</h2>
        <p className="text-xs text-charcoal-500 mt-1">
          The requested vehicle identifier does not exist in the active fleet.
        </p>
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-charcoal-900 underline"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Vehicles
        </Link>
      </div>
    );
  }

  const currentImage = uploadedImages[selectedImageIndex] || uploadedImages[0];
  const matchingProcessed = processedImages.find(
    (p) => p.original_image_id === currentImage?.id
  ) || processedImages[0];

  // Action: Enhance current image with sharp/engine
  const handleEnhanceImage = async (options: {
    templateId: BackgroundTemplateId;
    dealershipName?: string;
    bannerText?: string;
    normalizeLighting: boolean;
  }) => {
    if (!currentImage) return;
    setIsProcessingEnhance(true);

    try {
      const response = await fetch('/api/enhance-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageId: currentImage.id,
          vehicleId: vehicle.id,
          imageUrl: currentImage.file_path,
          templateId: options.templateId,
          bannerText: options.bannerText,
          normalizeLighting: options.normalizeLighting,
        }),
      });

      if (!response.ok) {
        throw new Error('Enhancement failed');
      }

      const result = await response.json();
      setProcessedImages((prev) => [result.processedImage, ...prev]);

      // Update vehicle status
      if (vehicle.status === 'intake' || vehicle.status === 'analyzing') {
        setVehicle({ ...vehicle, status: 'enhancing' });
      }
    } catch (err) {
      console.error('Enhancement error:', err);
    } finally {
      setIsProcessingEnhance(false);
    }
  };

  // Action: Run Gemini Vision Analysis on current image
  const handleRunVisionAnalysis = async () => {
    if (!currentImage) return;
    setIsAnalyzingVision(true);

    try {
      const response = await fetch('/api/analyze-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageId: currentImage.id,
          imageUrl: currentImage.file_path,
          vehicleContext: {
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const updatedImages = [...uploadedImages];
        updatedImages[selectedImageIndex] = {
          ...currentImage,
          ai_analysis: result.analysis,
          ai_quality_score: result.analysis.image_quality_score,
          ai_clarity: result.analysis.image_clarity,
          ai_lighting: result.analysis.lighting_condition,
        };
        setUploadedImages(updatedImages);
      }
    } catch (e) {
      console.error('Vision analysis error:', e);
    } finally {
      setIsAnalyzingVision(false);
    }
  };

  // Action: Generate or Regenerate Listing with AI
  const handleGenerateListing = async () => {
    setIsGeneratingListing(true);
    try {
      const response = await fetch('/api/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          customVehicleData: vehicle,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setListing(result.listing);
        setVehicle({ ...vehicle, status: 'listing_ready' });
      }
    } catch (e) {
      console.error('Listing generation error:', e);
    } finally {
      setIsGeneratingListing(false);
    }
  };

  // Action: Save Listing Edits
  const handleSaveListing = async (updated: Listing) => {
    try {
      await fetch('/api/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updated.id,
          updates: updated,
        }),
      });
      setListing(updated);
    } catch (e) {
      console.error('Error saving listing:', e);
    }
  };

  const currentDisplayProcessed = matchingProcessed?.processed_file_path || currentImage?.file_path;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-charcoal-200">
        <div className="flex items-center gap-3">
          <Link
            href="/vehicles"
            className="flex h-8 w-8 items-center justify-center rounded border border-charcoal-300 hover:bg-charcoal-100 text-charcoal-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-charcoal-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <span className="text-xs text-charcoal-500 font-mono">
                {vehicle.trim || vehicle.body_type}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-charcoal-500 font-mono mt-0.5">
              <span>VIN: {vehicle.vin}</span>
              <span>Stock: {vehicle.stock_number}</span>
              <span>${vehicle.price.toLocaleString()}</span>
              <span>{vehicle.mileage.toLocaleString()} mi</span>
            </div>
          </div>
        </div>

        {/* Status Pill & Action */}
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold uppercase bg-charcoal-100 text-charcoal-800 border border-charcoal-200">
            Status: {vehicle.status.replace('_', ' ')}
          </span>

          {listing?.status === 'published' ? (
            <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Published
            </span>
          ) : (
            <button
              onClick={handleGenerateListing}
              disabled={isGeneratingListing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-charcoal-900 text-white text-xs font-semibold hover:bg-charcoal-800 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{listing ? 'Update Listing' : 'Generate Listing with AI'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-charcoal-200 bg-white px-2 rounded-t shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('enhancer')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'enhancer'
              ? 'border-charcoal-900 text-charcoal-900'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-studio-accent" />
          <span>Studio Enhancer & Comparison</span>
        </button>

        <button
          onClick={() => setActiveTab('vision')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'vision'
              ? 'border-charcoal-900 text-charcoal-900'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <Camera className="h-3.5 w-3.5 text-charcoal-600" />
          <span>Gemini Vision Analysis</span>
        </button>

        <button
          onClick={() => setActiveTab('listing')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'listing'
              ? 'border-charcoal-900 text-charcoal-900'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-charcoal-600" />
          <span>AI Listing Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'quality'
              ? 'border-charcoal-900 text-charcoal-900'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Quality Audit ({qualityReport?.overallScore || 92}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'gallery'
              ? 'border-charcoal-900 text-charcoal-900'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5 text-charcoal-600" />
          <span>Media Gallery ({uploadedImages.length})</span>
        </button>
      </div>

      {/* Angle Thumbnails Row (when in Enhancer or Vision tab) */}
      {(activeTab === 'enhancer' || activeTab === 'vision') && uploadedImages.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {uploadedImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedImageIndex(idx)}
              className={`flex items-center gap-2 p-1.5 rounded border transition-all shrink-0 ${
                selectedImageIndex === idx
                  ? 'border-charcoal-900 bg-charcoal-50 ring-1 ring-charcoal-900 shadow-sm'
                  : 'border-charcoal-200 bg-white hover:border-charcoal-300'
              }`}
            >
              <div className="h-10 w-16 overflow-hidden rounded bg-charcoal-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.file_path}
                  alt={img.file_name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left pr-2">
                <span className="block text-[11px] font-semibold text-charcoal-900 capitalize">
                  {img.angle_label.replace(/_/g, ' ')}
                </span>
                <span className="block text-[9px] text-charcoal-400 font-mono">
                  {img.ai_quality_score ? `${img.ai_quality_score}/100 score` : 'Raw intake'}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Tab 1: Studio Enhancer & Image Comparison Slider */}
      {activeTab === 'enhancer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Image Comparison Slider */}
          <div className="lg:col-span-7 space-y-3">
            {currentImage ? (
              <ImageComparisonSlider
                originalUrl={currentImage.file_path}
                processedUrl={currentDisplayProcessed}
                originalLabel="Dealership Lot Intake"
                processedLabel={`StudioVision 4K (${matchingProcessed?.background_template?.replace(/_/g, ' ').toUpperCase() || 'WHITE STUDIO'})`}
              />
            ) : (
              <div className="aspect-[16/9] flex items-center justify-center rounded border border-charcoal-200 bg-charcoal-100 text-charcoal-400 text-xs">
                No images uploaded yet.
              </div>
            )}

            {/* Quick Actions under Slider */}
            <div className="flex items-center justify-between text-xs text-charcoal-500 pt-1">
              <span className="font-mono">
                Asset: {currentImage?.file_name || 'Vehicle photo'} • Angle: {currentImage?.angle_label.replace(/_/g, ' ')}
              </span>
              <button
                onClick={() =>
                  setLightboxData({
                    url: currentDisplayProcessed,
                    title: `${vehicle.year} ${vehicle.make} ${vehicle.model} - Studio Merchandised`,
                  })
                }
                className="text-xs font-semibold text-charcoal-900 hover:text-studio-accent underline"
              >
                Inspect in 4K Lightbox
              </button>
            </div>
          </div>

          {/* Right 5 Cols: Control Panel */}
          <div className="lg:col-span-5">
            <EnhanceControlPanel
              onProcessImage={handleEnhanceImage}
              isProcessing={isProcessingEnhance}
              defaultTemplate={matchingProcessed?.background_template || 'white_studio'}
              hasProcessedResult={Boolean(matchingProcessed)}
              onDownloadProcessed={() => {
                const a = document.createElement('a');
                a.href = currentDisplayProcessed;
                a.download = `studiovision-${vehicle.year}-${vehicle.make}-${vehicle.model}.webp`;
                a.click();
              }}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Gemini Vision Analysis */}
      {activeTab === 'vision' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-charcoal-50 p-3 rounded border border-charcoal-200">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-charcoal-700" />
              <span className="text-xs text-charcoal-700">
                Inspecting: <strong>{currentImage?.file_name}</strong> ({currentImage?.angle_label.replace(/_/g, ' ')})
              </span>
            </div>
            <button
              onClick={handleRunVisionAnalysis}
              disabled={isAnalyzingVision}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-charcoal-900 text-white text-xs font-medium hover:bg-charcoal-800 disabled:opacity-50"
            >
              <Sparkles className="h-3 w-3 text-studio-accent" />
              <span>{isAnalyzingVision ? 'Analyzing pixels...' : 'Re-Run Gemini Vision'}</span>
            </button>
          </div>

          {currentImage?.ai_analysis ? (
            <VisionAnalysisCard
              analysis={currentImage.ai_analysis}
              onUpdateAnalysis={(updated) => {
                const copy = [...uploadedImages];
                copy[selectedImageIndex].ai_analysis = updated;
                setUploadedImages(copy);
              }}
            />
          ) : (
            <div className="p-8 text-center rounded border border-charcoal-200 bg-white">
              <p className="text-xs text-charcoal-500 mb-3">
                No vision analysis stored for this frame yet.
              </p>
              <button
                onClick={handleRunVisionAnalysis}
                disabled={isAnalyzingVision}
                className="px-4 py-2 bg-charcoal-900 text-white text-xs font-semibold rounded hover:bg-charcoal-800"
              >
                Run Gemini Vision Analysis Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: AI Listing Generator */}
      {activeTab === 'listing' && (
        <div>
          {listing ? (
            <ListingEditor
              listing={listing}
              vehicle={vehicle}
              onSaveListing={handleSaveListing}
              onRegenerateWithAI={handleGenerateListing}
              isGenerating={isGeneratingListing}
            />
          ) : (
            <div className="p-8 text-center rounded border border-charcoal-200 bg-white">
              <h3 className="text-sm font-semibold text-charcoal-900 mb-1">
                No Listing Generated Yet
              </h3>
              <p className="text-xs text-charcoal-500 mb-4 max-w-md mx-auto">
                StudioVision AI can synthesize verified vehicle telemetry and Gemini visual findings into a high-converting retail listing.
              </p>
              <button
                onClick={handleGenerateListing}
                disabled={isGeneratingListing}
                className="px-5 py-2.5 bg-charcoal-900 text-white text-xs font-semibold rounded hover:bg-charcoal-800 shadow-sm"
              >
                {isGeneratingListing ? 'Drafting Listing...' : 'Generate Listing with AI'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Merchandising Quality Audit */}
      {activeTab === 'quality' && (
        <div className="space-y-6">
          {qualityReport && <QualityCheckCard report={qualityReport} />}
        </div>
      )}

      {/* Tab 5: Media Gallery */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-charcoal-900">
              Vehicle Visual Assets & High-Res Exports
            </h3>
            <span className="text-xs text-charcoal-500 font-mono">
              {uploadedImages.length} Intake / {processedImages.length} Studio Merchandised
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((img, idx) => {
              const proc = processedImages.find((p) => p.original_image_id === img.id);

              return (
                <div
                  key={img.id}
                  className="rounded border border-charcoal-200 bg-white overflow-hidden shadow-sm flex flex-col"
                >
                  <div
                    onClick={() =>
                      setLightboxData({
                        url: proc?.processed_file_path || img.file_path,
                        title: `${vehicle.year} ${vehicle.make} ${vehicle.model} - ${img.angle_label.replace(/_/g, ' ')}`,
                      })
                    }
                    className="relative aspect-[16/9] w-full bg-charcoal-100 cursor-pointer overflow-hidden group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={proc?.processed_file_path || img.file_path}
                      alt={img.file_name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />

                    <span className="absolute top-2 left-2 rounded bg-charcoal-900/80 backdrop-blur px-2 py-0.5 text-[10px] text-white font-mono uppercase">
                      {proc ? 'Studio 4K' : 'Raw Intake'}
                    </span>

                    <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white capitalize">
                      {img.angle_label.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="p-3 flex items-center justify-between text-xs border-t border-charcoal-100 mt-auto">
                    <span className="text-charcoal-500 font-mono text-[11px] truncate max-w-[140px]">
                      {img.file_name}
                    </span>
                    <a
                      href={proc?.processed_file_path || img.file_path}
                      download={`vehicle-${img.id}.jpg`}
                      className="text-charcoal-700 hover:text-charcoal-900 p-1"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxData && (
        <LightboxModal
          isOpen={Boolean(lightboxData)}
          onClose={() => setLightboxData(null)}
          imageUrl={lightboxData.url}
          title={lightboxData.title}
          subtitle="StudioVision AI High-Resolution 4K Export"
        />
      )}
    </div>
  );
}

