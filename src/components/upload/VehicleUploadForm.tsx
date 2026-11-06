'use client';

import React, { useState, useRef } from 'react';
import { CameraAngle } from '@/types/vehicle';
import {
  UploadCloud,
  FileImage,
  X,
  AlertCircle,
  CheckCircle2,
  Car,
  Tag,
  Hash,
  DollarSign,
  Gauge,
  Loader2,
} from 'lucide-react';

interface VehicleUploadFormProps {
  onSuccess: (newVehicleId: string) => void;
  onCancel?: () => void;
}

interface ImageUploadPreview {
  file: File;
  previewUrl: string;
  angle: CameraAngle;
  size: number;
}

export const VehicleUploadForm: React.FC<VehicleUploadFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  // Vehicle Metadata States
  const [year, setYear] = useState<number>(2024);
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [trim, setTrim] = useState<string>('');
  const [vin, setVin] = useState<string>('');
  const [stockNumber, setStockNumber] = useState<string>('');
  const [bodyType, setBodyType] = useState<string>('Sedan');
  const [exteriorColor, setExteriorColor] = useState<string>('');
  const [interiorColor, setInteriorColor] = useState<string>('');
  const [mileage, setMileage] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [transmission, setTransmission] = useState<string>('Automatic');
  const [drivetrain, setDrivetrain] = useState<string>('AWD');
  const [fuelType, setFuelType] = useState<string>('Gasoline');

  // File Upload States
  const [selectedImages, setSelectedImages] = useState<ImageUploadPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File validation
  const validateAndAddFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeBytes = 25 * 1024 * 1024; // 25 MB max per image
    const newPreviews: ImageUploadPreview[] = [];

    const defaultAngles: CameraAngle[] = [
      'front_three_quarter',
      'side_profile',
      'rear_three_quarter',
      'interior_cockpit',
      'wheel_rim',
    ];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(`File "${file.name}" is not supported. Please upload JPG, PNG, or WebP.`);
        return;
      }

      if (file.size > maxSizeBytes) {
        setErrorMessage(`File "${file.name}" exceeds the 25MB file size limit.`);
        return;
      }

      const assignedAngle = defaultAngles[(selectedImages.length + i) % defaultAngles.length];
      const previewUrl = URL.createObjectURL(file);

      newPreviews.push({
        file,
        previewUrl,
        angle: assignedAngle,
        size: file.size,
      });
    }

    setSelectedImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const updateImageAngle = (index: number, newAngle: CameraAngle) => {
    setSelectedImages((prev) => {
      const updated = [...prev];
      updated[index].angle = newAngle;
      return updated;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    validateAndAddFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim()) {
      setErrorMessage('Please provide both vehicle Make and Model.');
      return;
    }

    if (selectedImages.length === 0) {
      setErrorMessage('Please attach at least one vehicle intake photograph.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(15);
    setErrorMessage(null);

    try {
      // Convert images to base64 for reliable ingestion
      const uploadedImagePayloads = await Promise.all(
        selectedImages.map(async (img, idx) => {
          return new Promise<{
            fileName: string;
            fileSize: number;
            mimeType: string;
            angle: CameraAngle;
            base64Data: string;
          }>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                fileName: img.file.name,
                fileSize: img.size,
                mimeType: img.file.type,
                angle: img.angle,
                base64Data: reader.result as string,
              });
            };
            reader.readAsDataURL(img.file);
          });
        })
      );

      setUploadProgress(45);

      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          make: make.trim(),
          model: model.trim(),
          trim: trim.trim(),
          vin: vin.trim().toUpperCase() || `1G${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          stock_number: stockNumber.trim() || `APX-${Math.floor(1000 + Math.random() * 9000)}`,
          body_type: bodyType,
          exterior_color: exteriorColor.trim() || 'Metallic Silver',
          interior_color: interiorColor.trim() || 'Black Leather',
          mileage: Number(mileage) || 0,
          price: Number(price) || 0,
          transmission,
          drivetrain,
          fuel_type: fuelType,
          images: uploadedImagePayloads,
        }),
      });

      setUploadProgress(85);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to intake vehicle and upload images');
      }

      const result = await response.json();
      setUploadProgress(100);
      onSuccess(result.vehicle.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while uploading. Please check inputs.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Section 1: Vehicle Identification */}
      <div>
        <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-charcoal-500 mb-3">
          1. Vehicle Specifications & VIN
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">Model Year *</label>
            <input
              type="number"
              min={1990}
              max={2030}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
              className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">Make / Brand *</label>
            <input
              type="text"
              placeholder="e.g. Porsche, BMW, Mercedes"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              required
              className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">Model *</label>
            <input
              type="text"
              placeholder="e.g. Taycan 4S, M3, 911 Carrera"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
              className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">Trim / Package</label>
            <input
              type="text"
              placeholder="e.g. Competition xDrive"
              value={trim}
              onChange={(e) => setTrim(e.target.value)}
              className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">VIN (17 characters)</label>
            <input
              type="text"
              maxLength={17}
              placeholder="e.g. WP0AA2Y14PSA..."
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900 font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">Stock Number</label>
            <input
              type="text"
              placeholder="e.g. APX-2041"
              value={stockNumber}
              onChange={(e) => setStockNumber(e.target.value)}
              className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">Body Style</label>
            <select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
            >
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV / Crossover</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Truck">Pickup Truck</option>
              <option value="Wagon">Station Wagon</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">Exterior Paint Color</label>
            <input
              type="text"
              placeholder="e.g. Nardo Gray Metallic"
              value={exteriorColor}
              onChange={(e) => setExteriorColor(e.target.value)}
              className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">Odometer Mileage</label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 14200"
              value={mileage || ''}
              onChange={(e) => setMileage(Number(e.target.value))}
              className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">Listing Price ($ USD)</label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 68500"
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">Drivetrain</label>
            <select
              value={drivetrain}
              onChange={(e) => setDrivetrain(e.target.value)}
              className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
            >
              <option value="AWD">All-Wheel Drive (AWD)</option>
              <option value="RWD">Rear-Wheel Drive (RWD)</option>
              <option value="FWD">Front-Wheel Drive (FWD)</option>
              <option value="4WD">Four-Wheel Drive (4WD)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">Fuel / Propulsion</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full text-xs border border-charcoal-200 rounded px-3 py-2 bg-white text-charcoal-900"
            >
              <option value="Gasoline">Gasoline</option>
              <option value="Electric">All-Electric (BEV)</option>
              <option value="Plug-in Hybrid">Plug-in Hybrid (PHEV)</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Image Upload Dropzone */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-charcoal-500">
            2. High-Resolution Intake Photographs
          </h4>
          <span className="text-[11px] text-charcoal-500">
            JPG, PNG, WebP up to 25MB each
          </span>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-md border-2 border-dashed border-charcoal-300 bg-charcoal-50 hover:bg-charcoal-100/70 p-6 text-center transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => validateAndAddFiles(e.target.files)}
          />

          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white border border-charcoal-200 shadow-sm text-charcoal-600 mb-2">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-charcoal-900">
            Click to browse or drop dealer lot photographs here
          </p>
          <p className="text-[11px] text-charcoal-500 mt-1">
            StudioVision will analyze camera perspective, clarity, and isolate onto professional studio backdrops.
          </p>
        </div>

        {/* Selected Images Preview Grid */}
        {selectedImages.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-charcoal-800">
                Queued Photos ({selectedImages.length}):
              </span>
              <span className="text-[10px] text-charcoal-500 font-mono">
                Verify angle tags before processing
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {selectedImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative rounded border border-charcoal-200 bg-white p-1.5 shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-charcoal-100 mb-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.previewUrl}
                      alt={img.file.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-charcoal-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  <span className="text-[10px] text-charcoal-600 truncate font-mono mb-1">
                    {img.file.name}
                  </span>

                  <select
                    value={img.angle}
                    onChange={(e) => updateImageAngle(idx, e.target.value as CameraAngle)}
                    className="w-full text-[10px] border border-charcoal-200 rounded px-1 py-0.5 bg-charcoal-50 text-charcoal-800"
                  >
                    <option value="front_three_quarter">Front 3/4</option>
                    <option value="side_profile">Side Profile</option>
                    <option value="rear_three_quarter">Rear 3/4</option>
                    <option value="front_straight">Front Straight</option>
                    <option value="rear_straight">Rear Straight</option>
                    <option value="interior_cockpit">Interior Cockpit</option>
                    <option value="wheel_rim">Wheel / Rim</option>
                    <option value="engine_bay">Engine Bay</option>
                    <option value="trunk_cargo">Trunk / Cargo</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isSubmitting && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-charcoal-600">
            <span>Uploading assets to secure Supabase storage...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-charcoal-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-charcoal-900 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-charcoal-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded text-xs font-medium text-charcoal-600 hover:bg-charcoal-100 transition-colors"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 rounded bg-charcoal-900 text-white text-xs font-semibold hover:bg-charcoal-800 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-studio-accent" />
              <span>Ingesting Vehicle & Assets...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Complete Vehicle Intake</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

