# StudioVision AI – Intelligent Vehicle Merchandising Platform

> Enterprise AI automotive photography and digital merchandising platform designed for automobile dealerships. Transforms ordinary dealership lot photographs into listing-ready, commercial-grade vehicle presentations with Gemini Vision verification, studio background replacement, and AI copywriting.

---

## 🚘 Overview & Key Capabilities

StudioVision AI addresses the primary digital merchandising challenge automobile dealerships face: low-quality, cluttered lot photography that diminishes consumer engagement and delays vehicle turn times.

### Key Capabilities:
1. **Interactive Before / After Studio Evaluation**: Split comparison slider allowing dealerships to inspect optical isolation, contact tire shadow synthesis, and lighting uniformity.
2. **Gemini Vision Image Analysis**: Technical telemetry directly extracted from image pixels:
   - Vehicle category & stance classification
   - Observed paint color calibration
   - Camera angle classification (Front 3/4, Rear 3/4, Side Profile, Cockpit, Wheel/Rim, Engine)
   - Visible exterior features (e.g., Matrix LED headlights, Mission E wheels)
   - Verifiable defect & damage detection with transparent disclosure
3. **Studio Environment Replacement**:
   - Clean White Cyclorama Studio (complies with tier-1 marketplace syndication feeds)
   - Modern Dealership Showroom with polished concrete floor reflections
   - Neutral Outdoor Concourse under soft diffused illumination
   - Architectural Minimalist backdrop with dealership branding ribbon
   - Transparent PNG alpha cutout
4. **AI Listing Copywriter Agent**:
   - Compelling commercial titles and short summaries
   - Structured 3-paragraph marketing descriptions (Road Presence, Cabin Experience, Dealership Peace of Mind)
   - Verifiable bullet highlights
   - SEO-optimized SERP meta titles, descriptions, and high-converting keywords
   - One-click export to Monroney Window Sticker HTML, JSON, or CSV
5. **AI Quality Inspector**:
   - Continuous audit of fleet asset completeness
   - 5-angle mandatory coverage checklist
   - Lighting consistency and resolution metrics
   - Actionable merchandising recommendations
6. **Commercial SaaS Design System**:
   - Designed with clean white and light-gray surfaces, dark charcoal typography, subtle borders, and zero AI gimmicks.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router with Server Actions & API Routes)
- **UI & Styling**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Computer Vision**: Google Gemini Vision API (`@google/generative-ai`)
- **Image Processing Engine**: Server-side Sharp pipeline with procedural SVG studio backdrops, lighting normalization, and optional Remove.bg API integration
- **Database & Storage**: Supabase PostgreSQL with Row Level Security (RLS) policies and dual storage buckets (`vehicle-originals` and `vehicle-processed`)
- **Testing**: Node.js native test runner (`node:test`, `node:assert/strict`)
- **Deployment**: Vercel & GitHub Actions ready

---

## 📁 Repository Structure

```
StudioVision AI/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze-vision/route.ts    # Gemini Vision API integration
│   │   │   ├── enhance-image/route.ts     # Studio background compositor
│   │   │   ├── generate-listing/route.ts  # AI copywriting agent
│   │   │   ├── listings/route.ts          # Listing approval & status CRUD
│   │   │   ├── vehicles/route.ts          # Vehicle intake & fleet list
│   │   │   └── vehicles/[id]/route.ts     # Detail, update, & delete
│   │   ├── dashboard/page.tsx             # Dealership operational metrics & charts
│   │   ├── gallery/page.tsx               # Before/after comparison & lightbox
│   │   ├── listings/page.tsx              # Approval pipeline & export generator
│   │   ├── login/page.tsx                 # Dealership employee authentication
│   │   ├── quality/page.tsx               # Fleet merchandising quality audits
│   │   ├── settings/page.tsx              # Account, API keys & studio templates
│   │   ├── vehicles/page.tsx              # Vehicle inventory grid & filters
│   │   ├── vehicles/[id]/page.tsx         # Comprehensive 5-tab vehicle studio
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ai/
│   │   │   ├── QualityCheckCard.tsx
│   │   │   └── VisionAnalysisCard.tsx
│   │   ├── dashboard/
│   │   ├── enhancer/
│   │   │   └── EnhanceControlPanel.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── listings/
│   │   │   └── ListingEditor.tsx
│   │   ├── media/
│   │   │   ├── ImageComparisonSlider.tsx
│   │   │   └── LightboxModal.tsx
│   │   └── upload/
│   │       └── VehicleUploadForm.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── gemini-vision.ts
│   │   │   ├── listing-generator.ts
│   │   │   └── quality-checker.ts
│   │   ├── image-processing/
│   │   │   ├── background-templates.ts
│   │   │   └── enhancer.ts
│   │   ├── store/
│   │   │   └── vehicle-store.ts
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── server.ts
│   └── types/
│       └── vehicle.ts
├── supabase/
│   └── migrations/
│       └── 01_init.sql                    # Production schema with RLS & indexes
├── public/
│   └── backgrounds/                       # Studio background previews
├── tests/
│   └── test-suite.mjs                     # Critical unit tests
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-dealership/studiovision-ai.git
cd "StudioVision AI"
npm install
```

### 2. Environment Configuration
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment variables:
```ini
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (PostgreSQL & Storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Gemini API Key (obtain from Google AI Studio: https://aistudio.google.com)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional external image processing engines
REMOVE_BG_API_KEY=
```

> **Note**: StudioVision AI includes a zero-configuration local fallback engine. If Supabase or Gemini keys are not populated, the application immediately runs out-of-the-box with pre-seeded luxury fleet inventory and procedural sharp studio rendering.

### 3. Supabase Schema Setup
If you are connecting to a Supabase project, execute `supabase/migrations/01_init.sql` in your Supabase SQL Editor. This will provision:
- `dealerships`
- `profiles`
- `vehicles`
- `uploaded_images`
- `processed_images`
- `listings`
- `processing_jobs`
Along with complete Row Level Security (RLS) policies and storage permissions.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Production Build
```bash
npm run build
npm start
```

### 6. Run Test Suite
```bash
npm test
```

---

## 🔒 Truth-in-Merchandising Compliance

StudioVision AI adheres to strict automotive retail truth-in-advertising guidelines:
1. **Background Isolation Only**: Only the surrounding environment is removed or modified. Original vehicle body panels, wheel geometry, glass reflections, and badging are preserved without distortion.
2. **Defect Transparency**: Any visible cosmetic defect (scratches, rock chips, bumper scrapes) detected by Gemini Vision is surfaced and catalogued rather than airbrushed away.
3. **Verifiable Specifications**: AI-generated listings rely exclusively on factual vehicle identification telemetry (VIN, odometer, trim level) and visually verified features.

---

## 📄 License
Commercial Enterprise License. Proprietary to StudioVision AI.

