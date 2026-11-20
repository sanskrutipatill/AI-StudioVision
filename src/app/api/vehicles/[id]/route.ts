import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  INITIAL_VEHICLES,
  INITIAL_IMAGES,
  INITIAL_PROCESSED_IMAGES,
  INITIAL_LISTINGS,
} from '@/lib/store/vehicle-store';
import { evaluateVehicleMerchandisingQuality } from '@/lib/ai/quality-checker';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (vehicle) {
        const { data: images } = await supabase
          .from('uploaded_images')
          .select('*')
          .eq('vehicle_id', id)
          .order('display_order', { ascending: true });

        const { data: processed } = await supabase
          .from('processed_images')
          .select('*')
          .eq('vehicle_id', id);

        const { data: listing } = await supabase
          .from('listings')
          .select('*')
          .eq('vehicle_id', id)
          .maybeSingle();

        const qualityReport = evaluateVehicleMerchandisingQuality(images || [], listing);

        return NextResponse.json({
          vehicle,
          uploadedImages: images || [],
          processedImages: processed || [],
          listing: listing || null,
          qualityReport,
        });
      }
    }
  } catch (e) {
    console.warn('Supabase fetch error, checking local store:', e);
  }

  // Fallback to local store
  const vehicle = INITIAL_VEHICLES.find((v) => v.id === id);
  if (!vehicle) {
    return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
  }

  const uploadedImages = INITIAL_IMAGES.filter((img) => img.vehicle_id === id);
  const processedImages = INITIAL_PROCESSED_IMAGES.filter((p) => p.vehicle_id === id);
  const listing = INITIAL_LISTINGS.find((l) => l.vehicle_id === id) || null;
  const qualityReport = evaluateVehicleMerchandisingQuality(uploadedImages, listing);

  return NextResponse.json({
    vehicle,
    uploadedImages,
    processedImages,
    listing,
    qualityReport,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('vehicles')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (!error) return NextResponse.json({ vehicle: data });
    }
  } catch (e) {
    console.warn('Supabase update failed:', e);
  }

  const vehicleIndex = INITIAL_VEHICLES.findIndex((v) => v.id === id);
  if (vehicleIndex >= 0) {
    INITIAL_VEHICLES[vehicleIndex] = {
      ...INITIAL_VEHICLES[vehicleIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return NextResponse.json({ vehicle: INITIAL_VEHICLES[vehicleIndex] });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.from('vehicles').delete().eq('id', id);
    }
  } catch (e) {
    console.warn('Supabase delete error:', e);
  }

  const idx = INITIAL_VEHICLES.findIndex((v) => v.id === id);
  if (idx >= 0) {
    INITIAL_VEHICLES.splice(idx, 1);
  }

  return NextResponse.json({ success: true, deletedId: id });
}

