import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { INITIAL_LISTINGS, INITIAL_VEHICLES } from '@/lib/store/vehicle-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      let query = supabase.from('listings').select('*, vehicles(*)');
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        return NextResponse.json({ listings: data });
      }
    }
  } catch (e) {
    console.warn('Supabase listings fetch error:', e);
  }

  let listings = INITIAL_LISTINGS;
  if (statusFilter && statusFilter !== 'all') {
    listings = listings.filter((l) => l.status === statusFilter);
  }

  // Attach vehicle data for convenience
  const enriched = listings.map((l) => {
    const veh = INITIAL_VEHICLES.find((v) => v.id === l.vehicle_id);
    return { ...l, vehicles: veh };
  });

  return NextResponse.json({ listings: enriched });
}

export async function PATCH(request: Request) {
  try {
    const { id, status, updates } = await request.json();

    const patchData: any = { ...updates, updated_at: new Date().toISOString() };
    if (status) {
      patchData.status = status;
      if (status === 'published') {
        patchData.published_at = new Date().toISOString();
        patchData.approved_at = new Date().toISOString();
        patchData.approved_by = 'Dealership Merchandising Lead';
      }
    }

    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('listings')
          .update(patchData)
          .eq('id', id)
          .select()
          .single();

        if (!error) return NextResponse.json({ listing: data });
      }
    } catch (e) {
      console.warn('Supabase listing update skipped:', e);
    }

    const idx = INITIAL_LISTINGS.findIndex((l) => l.id === id);
    if (idx >= 0) {
      INITIAL_LISTINGS[idx] = { ...INITIAL_LISTINGS[idx], ...patchData };
      return NextResponse.json({ listing: INITIAL_LISTINGS[idx] });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

