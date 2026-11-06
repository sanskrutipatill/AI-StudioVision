-- ====================================================================
-- StudioVision AI – Supabase Database Schema & Storage Setup
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DEALERSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.dealerships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    license_number VARCHAR(100),
    contact_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip VARCHAR(20),
    website VARCHAR(255),
    logo_url TEXT,
    branding_banner_text TEXT DEFAULT 'VERIFIED CERTIFIED PRE-OWNED',
    default_studio_background VARCHAR(100) DEFAULT 'white_studio',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    dealership_id UUID REFERENCES public.dealerships(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'dealer_agent' CHECK (role IN ('superadmin', 'dealer_admin', 'dealer_agent', 'photographer')),
    avatar_url TEXT,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealership_id UUID REFERENCES public.dealerships(id) ON DELETE CASCADE NOT NULL,
    vin VARCHAR(17),
    stock_number VARCHAR(50),
    year INTEGER NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    trim VARCHAR(100),
    body_type VARCHAR(50) DEFAULT 'Sedan',
    exterior_color VARCHAR(100),
    interior_color VARCHAR(100),
    mileage INTEGER DEFAULT 0,
    price NUMERIC(12, 2) DEFAULT 0.00,
    transmission VARCHAR(50) DEFAULT 'Automatic',
    fuel_type VARCHAR(50) DEFAULT 'Gasoline',
    drivetrain VARCHAR(50) DEFAULT 'AWD',
    status VARCHAR(50) DEFAULT 'intake' CHECK (status IN ('intake', 'analyzing', 'enhancing', 'listing_ready', 'published', 'archived')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. UPLOADED IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.uploaded_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    width INTEGER,
    height INTEGER,
    display_order INTEGER DEFAULT 0,
    angle_label VARCHAR(100) DEFAULT 'unassigned',
    detected_features JSONB DEFAULT '{}'::jsonb,
    ai_quality_score NUMERIC(4, 2) DEFAULT 0.0,
    ai_clarity VARCHAR(50) DEFAULT 'good',
    ai_lighting VARCHAR(50) DEFAULT 'good',
    damage_detected BOOLEAN DEFAULT FALSE,
    damage_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. PROCESSED IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.processed_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    original_image_id UUID REFERENCES public.uploaded_images(id) ON DELETE CASCADE NOT NULL,
    processed_file_path TEXT NOT NULL,
    background_template VARCHAR(100) DEFAULT 'white_studio',
    resolution_label VARCHAR(50) DEFAULT '4K-Enhanced',
    enhancements_applied JSONB DEFAULT '[]'::jsonb,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    dealership_id UUID REFERENCES public.dealerships(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'published', 'archived')),
    title VARCHAR(255) NOT NULL,
    short_summary TEXT,
    marketing_description TEXT NOT NULL,
    key_highlights JSONB DEFAULT '[]'::jsonb,
    feature_summary JSONB DEFAULT '{}'::jsonb,
    seo_title VARCHAR(255),
    seo_meta_description TEXT,
    seo_keywords JSONB DEFAULT '[]'::jsonb,
    quality_score NUMERIC(4, 2) DEFAULT 0.0,
    quality_checklist JSONB DEFAULT '{}'::jsonb,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. PROCESSING JOBS TABLE
CREATE TABLE IF NOT EXISTS public.processing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('vision_analysis', 'background_removal', 'background_replacement', 'listing_generation', 'full_pipeline')),
    status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    progress_percent INTEGER DEFAULT 0,
    error_message TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    result JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. INDEXES FOR HIGH-THROUGHPUT RETRIEVAL
CREATE INDEX IF NOT EXISTS idx_vehicles_dealership ON public.vehicles(dealership_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_vehicle ON public.uploaded_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_processed_images_vehicle ON public.processed_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_listings_dealership ON public.listings(dealership_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_vehicle ON public.processing_jobs(vehicle_id);

-- 10. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.dealerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processed_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view & manage records belonging to their dealership
CREATE POLICY "Profiles viewable by user" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles updatable by user" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Dealership viewable by members" ON public.dealerships FOR SELECT USING (
    id IN (SELECT dealership_id FROM public.profiles WHERE profiles.id = auth.uid())
);

CREATE POLICY "Vehicles viewable by dealership members" ON public.vehicles FOR ALL USING (
    dealership_id IN (SELECT dealership_id FROM public.profiles WHERE profiles.id = auth.uid())
);

CREATE POLICY "Uploaded images viewable by vehicle dealership" ON public.uploaded_images FOR ALL USING (
    vehicle_id IN (
        SELECT v.id FROM public.vehicles v 
        JOIN public.profiles p ON p.dealership_id = v.dealership_id 
        WHERE p.id = auth.uid()
    )
);

CREATE POLICY "Processed images viewable by vehicle dealership" ON public.processed_images FOR ALL USING (
    vehicle_id IN (
        SELECT v.id FROM public.vehicles v 
        JOIN public.profiles p ON p.dealership_id = v.dealership_id 
        WHERE p.id = auth.uid()
    )
);

CREATE POLICY "Listings viewable by vehicle dealership" ON public.listings FOR ALL USING (
    dealership_id IN (SELECT dealership_id FROM public.profiles WHERE profiles.id = auth.uid())
);

CREATE POLICY "Jobs viewable by vehicle dealership" ON public.processing_jobs FOR ALL USING (
    vehicle_id IN (
        SELECT v.id FROM public.vehicles v 
        JOIN public.profiles p ON p.dealership_id = v.dealership_id 
        WHERE p.id = auth.uid()
    )
);

-- STORAGE BUCKETS (run in Supabase SQL editor or automated setup)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-originals', 'vehicle-originals', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-processed', 'vehicle-processed', true) ON CONFLICT DO NOTHING;

