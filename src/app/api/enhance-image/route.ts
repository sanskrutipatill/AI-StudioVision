import { NextResponse } from 'next/server';
import { enhanceVehicleImage } from '@/lib/image-processing/enhancer';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { INITIAL_IMAGES, INITIAL_PROCESSED_IMAGES } from '@/lib/store/vehicle-store';
import { ProcessedImage } from '@/types/vehicle';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const {
      imageId,
      vehicleId,
      templateId = 'white_studio',
      bannerText,
      normalizeLighting = true,
      imageUrl,
      imageBase64,
    } = await request.json();

    let imageBuffer: Buffer | null = null;

    if (imageBase64) {
      let base64Clean = imageBase64;
      if (imageBase64.startsWith('data:')) {
        base64Clean = imageBase64.split(',')[1];
      }
      imageBuffer = Buffer.from(base64Clean, 'base64');
    } else if (imageUrl) {
      const resp = await fetch(imageUrl);
      const arrayBuf = await resp.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuf);
    } else if (imageId) {
      const found = INITIAL_IMAGES.find((img) => img.id === imageId);
      if (found) {
        if (found.file_path.startsWith('data:')) {
          const base64Clean = found.file_path.split(',')[1];
          imageBuffer = Buffer.from(base64Clean, 'base64');
        } else {
          const resp = await fetch(found.file_path);
          const arrayBuf = await resp.arrayBuffer();
          imageBuffer = Buffer.from(arrayBuf);
        }
      }
    }

    if (!imageBuffer) {
      return NextResponse.json({ error: 'Valid image source required for enhancement' }, { status: 400 });
    }

    // Run high-precision studio processing
    const enhancementResult = await enhanceVehicleImage(imageBuffer, {
      templateId,
      bannerText,
      normalizeLighting,
      targetWidth: 1920,
      targetHeight: 1080,
    });

    const newProcessedRecord: ProcessedImage = {
      id: `proc-${Date.now()}`,
      vehicle_id: vehicleId || 'veh-current',
      original_image_id: imageId || 'img-orig',
      original_file_path: imageUrl || imageId || '',
      processed_file_path: enhancementResult.dataUrl,
      background_template: templateId,
      resolution_label: '4K Merchandised',
      enhancements_applied: enhancementResult.enhancementsApplied,
      is_primary: true,
      created_at: new Date().toISOString(),
    };

    // Save to Supabase if available
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        await supabase.from('processed_images').insert([newProcessedRecord]);
      }
    } catch (e) {
      console.warn('Supabase processed image save skipped:', e);
    }

    INITIAL_PROCESSED_IMAGES.unshift(newProcessedRecord);

    return NextResponse.json({
      success: true,
      processedImage: newProcessedRecord,
      dataUrl: enhancementResult.dataUrl,
      enhancementsApplied: enhancementResult.enhancementsApplied,
    });
  } catch (err: any) {
    console.error('Enhancement API failed:', err);
    return NextResponse.json({ error: err.message || 'Image enhancement failed' }, { status: 500 });
  }
}

