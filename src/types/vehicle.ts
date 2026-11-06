export type VehicleStatus = 
  | 'intake' 
  | 'analyzing' 
  | 'enhancing' 
  | 'listing_ready' 
  | 'published' 
  | 'archived';

export type ListingStatus = 
  | 'draft' 
  | 'pending_approval' 
  | 'published' 
  | 'archived';

export type CameraAngle = 
  | 'front_three_quarter'
  | 'rear_three_quarter'
  | 'front_straight'
  | 'rear_straight'
  | 'side_profile'
  | 'interior_cockpit'
  | 'interior_rear'
  | 'wheel_rim'
  | 'engine_bay'
  | 'trunk_cargo'
  | 'unassigned';

export type BackgroundTemplateId = 
  | 'white_studio' 
  | 'dealership_showroom' 
  | 'neutral_outdoor' 
  | 'architectural_modern' 
  | 'transparent';

export interface BackgroundTemplate {
  id: BackgroundTemplateId;
  name: string;
  description: string;
  lightingTone: 'bright-neutral' | 'warm-showroom' | 'natural-diffuse' | 'clean-white';
  floorReflection: boolean;
  bannerIncluded: boolean;
  previewUrl: string;
}

export interface Vehicle {
  id: string;
  dealership_id: string;
  vin: string;
  stock_number: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  body_type: string;
  exterior_color: string;
  interior_color: string;
  mileage: number;
  price: number;
  transmission: string;
  fuel_type: string;
  drivetrain: string;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
  images_count?: number;
  processed_count?: number;
}

export interface VisionAnalysisResult {
  vehicle_category: string;
  approximate_color: string;
  camera_angle: CameraAngle;
  lighting_condition: 'excellent' | 'adequate' | 'harsh_shadows' | 'underexposed' | 'overexposed';
  image_quality_score: number; // 0 - 100
  image_clarity: 'crisp' | 'acceptable' | 'soft_focus' | 'blurry';
  visible_exterior_features: string[];
  visible_damage_or_imperfections: string[];
  has_damage: boolean;
  background_complexity: 'clean' | 'moderate' | 'cluttered_distracting';
  composition_assessment: string;
  actionable_recommendations: string[];
}

export interface UploadedImage {
  id: string;
  vehicle_id: string;
  file_name: string;
  file_path: string; // URL or data URL
  file_size_bytes: number;
  mime_type: string;
  width?: number;
  height?: number;
  display_order: number;
  angle_label: CameraAngle;
  ai_analysis?: VisionAnalysisResult;
  ai_quality_score?: number;
  ai_clarity?: string;
  ai_lighting?: string;
  damage_detected?: boolean;
  damage_notes?: string;
  created_at: string;
}

export interface ProcessedImage {
  id: string;
  vehicle_id: string;
  original_image_id: string;
  original_file_path: string;
  processed_file_path: string;
  background_template: BackgroundTemplateId;
  resolution_label: string;
  enhancements_applied: string[];
  is_primary: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  vehicle_id: string;
  dealership_id: string;
  status: ListingStatus;
  title: string;
  short_summary: string;
  marketing_description: string;
  key_highlights: string[];
  feature_summary: {
    performance?: string[];
    exterior?: string[];
    interior_tech?: string[];
    safety?: string[];
  };
  seo_title: string;
  seo_meta_description: string;
  seo_keywords: string[];
  quality_score: number;
  quality_checklist: {
    photo_count_adequate: boolean;
    essential_angles_covered: boolean;
    background_standardized: boolean;
    vin_verified: boolean;
    pricing_disclosed: boolean;
    damage_disclosed: boolean;
  };
  approved_by?: string;
  approved_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  vehicles?: Vehicle;
}

export interface QualityReport {
  overallScore: number; // 0 - 100
  ratingLabel: 'Exceptional' | 'Listing Ready' | 'Needs Review' | 'Incomplete';
  missingAngles: CameraAngle[];
  duplicateAngles: CameraAngle[];
  lightingConsistencyScore: number;
  resolutionCheck: 'Passed' | 'Warning' | 'Failed';
  backgroundStandardizationRatio: number; // 0.0 - 1.0
  actionableSuggestions: string[];
  overall_score?: number;
  rating_label?: 'Exceptional' | 'Listing Ready' | 'Needs Review' | 'Incomplete';
}

export interface ProcessingJob {
  id: string;
  vehicle_id: string;
  job_type: 'vision_analysis' | 'background_removal' | 'background_replacement' | 'listing_generation' | 'full_pipeline';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress_percent: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

