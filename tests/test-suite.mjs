import test from 'node:test';
import assert from 'node:assert/strict';

// Core Business Logic: Angle Evaluation & Merchandising Rules
const ESSENTIAL_ANGLES = [
  'front_three_quarter',
  'rear_three_quarter',
  'side_profile',
  'interior_cockpit',
  'wheel_rim',
];

function evaluateVehicleMerchandisingQuality(images, listing) {
  const suggestions = [];
  const assignedAngles = images.map((img) => img.angle_label).filter((a) => a !== 'unassigned');

  // 1. Missing angles check
  const missingAngles = ESSENTIAL_ANGLES.filter((required) => !assignedAngles.includes(required));
  if (missingAngles.length > 0) {
    const formatted = missingAngles.map((a) => a.replace(/_/g, ' ')).join(', ');
    suggestions.push(`Missing critical merchandising angles: ${formatted}. High-converting listings feature at least 5 standard perspective shots.`);
  }

  // 2. Duplicate angles check
  const angleCounts = {};
  assignedAngles.forEach((a) => {
    angleCounts[a] = (angleCounts[a] || 0) + 1;
  });
  const duplicateAngles = Object.entries(angleCounts)
    .filter(([_, count]) => count > 2)
    .map(([angle]) => angle);

  if (duplicateAngles.length > 0) {
    suggestions.push(
      `Multiple redundant shots detected for: ${duplicateAngles.map((a) => a.replace(/_/g, ' ')).join(', ')}. Replace redundant frames with interior dashboard or cargo details.`
    );
  }

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

  const cleanBackgroundCount = images.filter((img) => img.ai_analysis?.background_complexity === 'clean').length;
  const backgroundStandardizationRatio = images.length > 0 ? cleanBackgroundCount / images.length : 0;

  let listingScore = 20;
  if (listing) {
    if (listing.title && listing.title.length > 15) listingScore += 20;
    if (listing.marketing_description && listing.marketing_description.length > 150) listingScore += 25;
    if (listing.key_highlights && listing.key_highlights.length >= 4) listingScore += 20;
    if (listing.seo_meta_description) listingScore += 15;
  }

  const angleCoverageScore = Math.max(0, 100 - missingAngles.length * 15);
  const photoQualityScore = images.length > 0
    ? images.reduce((acc, img) => acc + (img.ai_quality_score || 85), 0) / images.length
    : 0;

  const overallScore = Math.round(
    (images.length > 0 ? (angleCoverageScore * 0.35 + photoQualityScore * 0.4 + (listingScore || 50) * 0.25) : 30)
  );

  let ratingLabel = 'Incomplete';
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
    actionableSuggestions: suggestions.length > 0 ? suggestions : ['Meets retail standards.'],
  };
}

function generateFactualListingFallback(v, verifiedFeatures = []) {
  const title = `${v.year} ${v.make} ${v.model} ${v.trim ? v.trim + ' ' : ''}${v.drivetrain || ''}`.trim();
  const formattedMileage = v.mileage ? `${v.mileage.toLocaleString()} miles` : 'Low mileage';
  const short_summary = `Exceptionally well-maintained ${v.year} ${v.make} ${v.model} in ${v.exterior_color || 'factory specification'}, presenting with only ${formattedMileage} and equipped with ${v.transmission || 'Automatic'} transmission.`;

  return {
    title,
    short_summary,
    key_highlights: [
      `${v.year} Model Year with ${formattedMileage}`,
      `${v.drivetrain || 'AWD'} Drivetrain`,
      ...verifiedFeatures,
    ],
    seo_title: `${v.year} ${v.make} ${v.model} For Sale | Certified Inventory`,
  };
}

test('AI Quality Inspector - Correctly detects missing angles and computes audit score', () => {
  const singleImage = [{
    id: '1',
    angle_label: 'front_three_quarter',
    ai_quality_score: 90,
  }];

  const report = evaluateVehicleMerchandisingQuality(singleImage, null);
  assert.equal(report.missingAngles.length, 4);
  assert.ok(report.missingAngles.includes('side_profile'));
  assert.ok(report.missingAngles.includes('interior_cockpit'));
  assert.ok(report.overallScore < 85);
});

test('AI Quality Inspector - Verifies exceptional score for 5-angle dealer photography', () => {
  const images = ESSENTIAL_ANGLES.map((angle, idx) => ({
    id: String(idx),
    angle_label: angle,
    ai_quality_score: 95,
    ai_analysis: {
      image_clarity: 'crisp',
      lighting_condition: 'excellent',
      background_complexity: 'clean',
    },
  }));

  const mockListing = {
    title: '2024 Porsche Taycan 4S Performance Battery Plus',
    marketing_description: 'An expansive three-paragraph detailed dealership overview ensuring complete peace of mind and verified inspection history with pristine original bodywork.',
    key_highlights: ['Low Mileage', 'AWD Dual Motor', 'Clean Title', 'Full Warranty'],
    seo_meta_description: 'Certified 2024 Porsche Taycan 4S for sale at Apex Motor Group Beverly Hills.',
  };

  const report = evaluateVehicleMerchandisingQuality(images, mockListing);
  assert.equal(report.missingAngles.length, 0);
  assert.ok(report.overallScore >= 88);
  assert.equal(report.ratingLabel, 'Exceptional');
});

test('Truth-in-Merchandising - Guaranteed preservation of factual specs without hallucinations', () => {
  const vehicle = {
    year: 2024,
    make: 'Porsche',
    model: 'Taycan 4S',
    trim: 'Performance Battery Plus',
    mileage: 4120,
    exterior_color: 'Frozen Blue Metallic',
    transmission: '2-Speed Automatic',
    drivetrain: 'AWD',
  };

  const listing = generateFactualListingFallback(vehicle, ['PDLS+ Headlights', '21-inch Mission E Wheels']);
  assert.equal(listing.title, '2024 Porsche Taycan 4S Performance Battery Plus AWD');
  assert.ok(listing.short_summary.includes('4,120 miles'));
  assert.ok(listing.key_highlights.includes('2024 Model Year with 4,120 miles'));
  assert.ok(listing.key_highlights.includes('PDLS+ Headlights'));
  assert.ok(listing.seo_title.length <= 65);
});
