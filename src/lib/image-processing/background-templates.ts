import { BackgroundTemplate } from '@/types/vehicle';

export const BACKGROUND_TEMPLATES: BackgroundTemplate[] = [
  {
    id: 'white_studio',
    name: 'Clean White Studio',
    description: 'High-key infinite white cyclorama with soft floor reflection and horizon graduation. Compliant with major retail marketplaces.',
    lightingTone: 'clean-white',
    floorReflection: true,
    bannerIncluded: false,
    previewUrl: '/backgrounds/white_studio.svg',
  },
  {
    id: 'dealership_showroom',
    name: 'Modern Dealership Showroom',
    description: 'Polished charcoal concrete floor, architectural steel pillars, and ambient ceiling spotlighting for a high-end luxury feel.',
    lightingTone: 'warm-showroom',
    floorReflection: true,
    bannerIncluded: true,
    previewUrl: '/backgrounds/showroom.svg',
  },
  {
    id: 'neutral_outdoor',
    name: 'Neutral Outdoor Pavillion',
    description: 'Clean architectural paved concourse under soft diffused overcast sky. Natural colors without distracting parked cars or utility poles.',
    lightingTone: 'natural-diffuse',
    floorReflection: false,
    bannerIncluded: false,
    previewUrl: '/backgrounds/outdoor.svg',
  },
  {
    id: 'architectural_modern',
    name: 'Architectural Minimalist',
    description: 'Geometric brushed-concrete wall with muted natural illumination, spotlighting the vehicle lines without distraction.',
    lightingTone: 'bright-neutral',
    floorReflection: true,
    bannerIncluded: true,
    previewUrl: '/backgrounds/architectural.svg',
  },
  {
    id: 'transparent',
    name: 'Isolated PNG (Transparent)',
    description: 'Vehicle foreground cleanly masked with transparent alpha background for custom marketing collateral and syndication feeds.',
    lightingTone: 'clean-white',
    floorReflection: false,
    bannerIncluded: false,
    previewUrl: '/backgrounds/transparent.svg',
  },
];

