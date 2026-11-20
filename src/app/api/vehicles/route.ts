import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { INITIAL_VEHICLES, INITIAL_IMAGES } from '@/lib/store/vehicle-store';
import { Vehicle, UploadedImage } from '@/types/vehicle';

export const dynamic = 'force-dynamic';

// In-memory runtime storage for when Supabase is not yet populated
let memoryVehicles: Vehicle[] = [...INITIAL_VEHICLES];
let memoryImages: UploadedImage[] = [...INITIAL_IMAGES];

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, uploaded_images(count), processed_images(count)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return NextResponse.json({ vehicles: data });
      }
    }
  } catch (err) {
    console.warn('Supabase query failed, returning local storage:', err);
  }

  return NextResponse.json({
    vehicles: memoryVehicles.map((v) => ({
      ...v,
      images_count: memoryImages.filter((img) => img.vehicle_id === v.id).length,
    })),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vehicleId = `veh-${Date.now().toString(36)}`;

    const newVehicle: Vehicle = {
      id: vehicleId,
      dealership_id: 'd-101',
      vin: body.vin || 'VIN-UNASSIGNED',
      stock_number: body.stock_number || `STK-${Math.floor(1000 + Math.random() * 9000)}`,
      year: Number(body.year) || 2024,
      make: body.make,
      model: body.model,
      trim: body.trim || '',
      body_type: body.body_type || 'Sedan',
      exterior_color: body.exterior_color || 'Standard Paint',
      interior_color: body.interior_color || 'Standard Interior',
      mileage: Number(body.mileage) || 0,
      price: Number(body.price) || 0,
      transmission: body.transmission || 'Automatic',
      fuel_type: body.fuel_type || 'Gasoline',
      drivetrain: body.drivetrain || 'AWD',
      status: 'analyzing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newUploadedImages: UploadedImage[] = [];

    if (Array.isArray(body.images)) {
      body.images.forEach((img: any, idx: number) => {
        newUploadedImages.push({
          id: `img-${Date.now()}-${idx}`,
          vehicle_id: vehicleId,
          file_name: img.fileName || `vehicle_photo_${idx + 1}.jpg`,
          file_path: img.base64Data, // Stores data URL
          file_size_bytes: img.fileSize || 1024 * 1024,
          mime_type: img.mimeType || 'image/jpeg',
          display_order: idx + 1,
          angle_label: img.angle || 'front_three_quarter',
          created_at: new Date().toISOString(),
        });
      });
    }

    // Try Supabase first
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('vehicles').insert([newVehicle]);
        if (newUploadedImages.length > 0) {
          await supabase.from('uploaded_images').insert(newUploadedImages);
        }
      } catch (e) {
        console.warn('Supabase insert skipped or errored:', e);
      }
    }

    // Update in-memory runtime cache
    memoryVehicles.unshift(newVehicle);
    memoryImages.push(...newUploadedImages);

    return NextResponse.json({
      vehicle: newVehicle,
      imagesCount: newUploadedImages.length,
      success: true,
    });
  } catch (err: any) {
    console.error('Error in vehicle intake API:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

