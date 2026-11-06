import { CameraAngle, QualityReport, UploadedImage, Listing } from '../../types/vehicle';

const ESSENTIAL_ANGLES: CameraAngle[] = [
  'front_three_quarter',
  'rear_three_quarter',
  'side_profile',
  'interior_cockpit',
  'wheel_rim',
];

export function evaluateVehicleMerchandisingQuality(
  images: UploadedImage[],
  listing?: Listing | null
): QualityReport {
  const suggestions: string[] = [];
  const assignedAngles: CameraAngle[] = images.map((img) => img.angle_label).filter((a) => a !== 'unassigned');

  // 1. Missing angles check
  const missingAngles = ESSENTIAL_ANGLES.filter((required) => !assignedAngles.includes(required));
  if (missingAngles.length > 0) {
    const formatted = missingAngles.map((a) => a.replace(/_/g, ' ')).join(', ');
    suggestions.push(`Missing critical merchandising angles: ${formatted}. High-converting listings feature at least 5 standard perspective shots.`);
  }

  // 2. Duplicate angles check
  const angleCounts: Record<string, number> = {};
  assignedAngles.forEach((a) => {
    angleCounts[a] = (angleCounts[a] || 0) + 1;
  });
  const duplicateAngles = Object.entries(angleCounts)
    .filter(([_, count]) => count > 2)
    .map(([angle]) => angle as CameraAngle);

  if (duplicateAngles.length > 0) {
    suggestions.push(
      `Multiple redundant shots detected for: ${duplicateAngles.map((a) => a.replace(/_/g, ' ')).join(', ')}. Replace redundant frames with interior dashboard or cargo details.`
    );
  }

  // 3. Clarity & resolution analysis
  let lowClarityCount = 0;
  let harshLightingCount = 0;

  images.forEach((img) => {
    if (img.ai_analysis) {
      if (img.ai_analysis.image_clarity === 'soft_focus' || img.ai_analysis.image_clarity === 'blurry') {
        lowClarityCount++;
      }
      if (img.ai_analysis.lighting_condition === 'harsh_shadows' || img.ai_analysis.lighting_condition === 'underexposed') {
        harshLightingCount++;
      }
    }
  });

  if (lowClarityCount > 0) {
    suggestions.push(`${lowClarityCount} image(s) show noticeable motion blur or soft focus. Re-shoot on a stable tripod or steady camera rig.`);
  }

  if (harshLightingCount > 0) {
    suggestions.push(`${harshLightingCount} image(s) have harsh specular reflections or heavy shadows. Apply StudioVision studio enhancement to balance illumination.`);
  }

  // 4. Background consistency check
  const cleanBackgroundCount = images.filter((img) => img.ai_analysis?.background_complexity === 'clean').length;
  const backgroundStandardizationRatio = images.length > 0 ? cleanBackgroundCount / images.length : 0;

  if (backgroundStandardizationRatio < 0.7 && images.length > 0) {
    suggestions.push('Dealership lot backgrounds vary noticeably across photos. Batch process all images through "Clean White Studio" for cohesive tier-1 branding.');
  }

  // 5. Listing description & data completeness check
  let listingScore = 20;
  if (listing) {
    if (listing.title && listing.title.length > 15) listingScore += 20;
    if (listing.marketing_description && listing.marketing_description.length > 150) listingScore += 25;
    if (listing.key_highlights && listing.key_highlights.length >= 4) listingScore += 20;
    if (listing.seo_meta_description) listingScore += 15;
  } else {
    suggestions.push('No vehicle listing generated yet. Run the AI Listing Generator to draft SEO-ready marketing descriptions.');
  }

  // Calculate overall score (0 - 100)
  const angleCoverageScore = Math.max(0, 100 - missingAngles.length * 15);
  const photoQualityScore = images.length > 0
    ? images.reduce((acc, img) => acc + (img.ai_quality_score || 85), 0) / images.length
    : 0;

  const overallScore = Math.round(
    (images.length > 0 ? (angleCoverageScore * 0.35 + photoQualityScore * 0.4 + (listingScore || 50) * 0.25) : 30)
  );

  let ratingLabel: QualityReport['rating_label'] = 'Incomplete';
  if (overallScore >= 88) ratingLabel = 'Exceptional';
  else if (overallScore >= 72) ratingLabel = 'Listing Ready';
  else if (overallScore >= 50) ratingLabel = 'Needs Review';

  return {
    overallScore,
    ratingLabel,
    missingAngles,
    duplicateAngles,
    lightingConsistencyScore: Math.round(100 - harshLightingCount * 12),
    resolutionCheck: lowClarityCount === 0 ? 'Passed' : lowClarityCount <= 2 ? 'Warning' : 'Failed',
    backgroundStandardizationRatio,
    actionableSuggestions: suggestions.length > 0 ? suggestions : [
      'Photography and merchandising meet prime retail standards.',
      'All 5 essential exterior and interior angles are clearly captured.',
      'Lighting and clarity are consistent across all asset frames.',
    ],
  };
}

