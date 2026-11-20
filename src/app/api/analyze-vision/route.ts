import { NextResponse } from 'next/server';
import { analyzeVehicleImageWithGemini } from '@/lib/ai/gemini-vision';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { INITIAL_IMAGES } from '@/lib/store/vehicle-store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { imageId, imageUrl, imageBase64, mimeType, vehicleContext } = await request.json();

    const inputData = imageBase64 || imageUrl;
    if (!inputData) {
      return NextResponse.json({ error: 'Image data or URL is required' }, { status: 400 });
    }

    const analysisResult = await analyzeVehicleImageWithGemini(
      inputData,
      mimeType || 'image/jpeg',
      vehicleContext
    );

    // Persist to Supabase if imageId is provided
    if (imageId) {
      try {
        const supabase = await createServerSupabaseClient();
        if (supabase) {
          await supabase
            .from('uploaded_images')
            .update({
              detected_features: analysisResult.visible_exterior_features,
              ai_quality_score: analysisResult.image_quality_score,
              ai_clarity: analysisResult.image_clarity,
              ai_lighting: analysisResult.lighting_condition,
              damage_detected: analysisResult.has_damage,
              damage_notes: analysisResult.visible_damage_or_imperfections.join('; '),
              angle_label: analysisResult.camera_angle,
            })
            .eq('id', imageId);
        }
      } catch (err) {
        console.warn('Supabase image analysis update skipped:', err);
      }

      // Update in local memory
      const img = INITIAL_IMAGES.find((i) => i.id === imageId);
      if (img) {
        img.ai_analysis = analysisResult;
        img.ai_quality_score = analysisResult.image_quality_score;
        img.ai_clarity = analysisResult.image_clarity;
        img.ai_lighting = analysisResult.lighting_condition;
        img.damage_detected = analysisResult.has_damage;
        img.damage_notes = analysisResult.visible_damage_or_imperfections.join('; ');
        img.angle_label = analysisResult.camera_angle;
      }
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
    });
  } catch (err: any) {
    console.error('Vision analysis API error:', err);
    return NextResponse.json({ error: err.message || 'Vision analysis failed' }, { status: 500 });
  }
}

