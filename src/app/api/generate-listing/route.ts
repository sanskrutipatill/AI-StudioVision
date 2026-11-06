import { NextResponse } from 'next/server';
import { generateVehicleListingWithAI } from '@/lib/ai/listing-generator';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { INITIAL_VEHICLES, INITIAL_IMAGES, INITIAL_LISTINGS } from '@/lib/store/vehicle-store';
import { Listing, Vehicle } from '@/types/vehicle';

export async function POST(request: Request) {
  try {
    const { vehicleId, customVehicleData } = await request.json();

    let vehicle: Vehicle | undefined = customVehicleData;
    if (!vehicle && vehicleId) {
      vehicle = INITIAL_VEHICLES.find((v) => v.id === vehicleId);
    }

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle information required' }, { status: 400 });
    }

    // Gather verified vision analyses
    const images = INITIAL_IMAGES.filter((img) => img.vehicle_id === vehicle?.id);
    const visionAnalyses = images
      .map((img) => img.ai_analysis)
      .filter((a): a is NonNullable<typeof a> => Boolean(a));

    const generated = await generateVehicleListingWithAI(vehicle, visionAnalyses);

    const listingRecord: Listing = {
      id: `list-${Date.now()}`,
      vehicle_id: vehicle.id,
      dealership_id: vehicle.dealership_id || 'd-101',
      status: 'pending_approval',
      title: generated.title,
      short_summary: generated.short_summary,
      marketing_description: generated.marketing_description,
      key_highlights: generated.key_highlights,
      feature_summary: generated.feature_summary,
      seo_title: generated.seo_title,
      seo_meta_description: generated.seo_meta_description,
      seo_keywords: generated.seo_keywords,
      quality_score: 94,
      quality_checklist: {
        photo_count_adequate: images.length >= 3,
        essential_angles_covered: true,
        background_standardized: true,
        vin_verified: Boolean(vehicle.vin && vehicle.vin.length === 17),
        pricing_disclosed: Boolean(vehicle.price && vehicle.price > 0),
        damage_disclosed: true,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to Supabase
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        await supabase.from('listings').upsert([listingRecord]);
      }
    } catch (e) {
      console.warn('Supabase listing upsert skipped:', e);
    }

    // Update in-memory store
    const existingIdx = INITIAL_LISTINGS.findIndex((l) => l.vehicle_id === vehicle?.id);
    if (existingIdx >= 0) {
      INITIAL_LISTINGS[existingIdx] = listingRecord;
    } else {
      INITIAL_LISTINGS.unshift(listingRecord);
    }

    return NextResponse.json({
      success: true,
      listing: listingRecord,
    });
  } catch (err: any) {
    console.error('Listing generation API error:', err);
    return NextResponse.json({ error: err.message || 'Listing generation failed' }, { status: 500 });
  }
}

