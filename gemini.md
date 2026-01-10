# Project Master Instruction File: Chennai Civic Sentinel

## 1. Project Context & Role
**Role:** Senior Full-Stack Architect & Product Engineer.
**Goal:** Build a production-ready "Frictionless" Civic Reporting PWA from scratch.
**Core Philosophy:** "Snap, Click, Done." A user must be able to report a violation in under 10 seconds.
**Aesthetic:** Sleek, high-contrast Dark Mode (Cyberpunk/Modern Civic tech), Mobile-First.

## 2. Infrastructure (Docker)
**Instruction:** Generate a `docker-compose.yml` file to spin up the required local services.
* **Service 1: Database (PostgreSQL + PostGIS)**
    * Image: `postgis/postgis:15-3.3`
    * Ports: `5432:5432`
    * Environment: User/Pass/DB (e.g., `postgres/postgres/chennai_sentinel`)
    * Persistence: Use a local volume.
* **Service 2: Redis (For Job Queues)**
    * Image: `redis:alpine`
    * Ports: `6379:6379`
* **Service 3: MinIO (S3 Compatible Storage - Optional)**
    * Image: `minio/minio`
    * Command: `server /data`
    * (Use this for local image storage testing if Supabase cloud isn't used immediately).

## 3. Database Schema (Schema & Migrations)
**Instruction:** Create a `setup.sql` migration script to define the following schema.

### Tables
1.  `zones`:
    * `id` (serial, PK), `name` (text, unique), `slug` (text).
2.  `complaint_categories`:
    * `id` (serial, PK), `name` (text), `icon_slug` (text - references Lucide icon name).
3.  `complaint_sub_categories`:
    * `id` (serial, PK), `category_id` (FK -> complaint_categories), `name` (text), `severity` (text: 'low', 'medium', 'critical').
4.  `reports`:
    * `id` (uuid, PK), `image_url` (text), `lat` (float), `lng` (float), `zone_id` (FK), `sub_category_id` (FK), `description` (text, nullable), `status` (enum: 'pending', 'approved', 'rejected'), `twitter_tweet_id` (text), `user_id` (uuid, nullable - for registered users), `created_at` (timestamp).
5.  `profiles` (Gamification):
    * `id` (uuid, PK), `user_id` (auth_id), `current_points` (int), `total_points_earned` (int), `badges` (jsonb).
6.  `rewards_catalog`:
    * `id` (serial, PK), `name` (text), `cost_points` (int), `type` (enum: 'merch', 'coupon'), `brand_name` (text), `image_url` (text).

## 4. Seed Data (The "Ground Truth")
**Instruction:** Include these EXACT insert statements in `setup.sql`.

**A. Zones (Official Chennai Areas)**
`Adyar`, `Alandur`, `Alwarpet`, `Ambattur`, `Aminjikarai`, `Anna Nagar`, `Anna Salai`, `Arumbakkam`, `Ashok Nagar`, `Ayanavaram`, `Besant Nagar`, `Broadway`, `Chetpet`, `Choolai`, `Choolaimedu`, `Chromepet`, `Egmore`, `Ekkattuthangal`, `Ennore`, `George Town`, `Gopalapuram`, `Guindy`, `Jafferkhanpet`, `K.K. Nagar`, `Kodambakkam`, `Kodungaiyur`, `Kolathur`, `Korattur`, `Kotturpuram`, `Koyambedu`, `Madhavaram`, `Madipakkam`, `Maduravoyal`, `Manali`, `Manapakkam`, `Mandaveli`, `Mogappair`, `Mylapore`, `Nandanam`, `Nanganallur`, `Neelangarai`, `Nungambakkam`, `Pallikaranai`, `Parrys`, `Perambur`, `Perungudi`, `Porur`, `Purasaiwakkam`, `R.A. Puram`, `Ramapuram`, `Royapettah`, `Royapuram`, `Saidapet`, `Saligramam`, `Sholinganallur`, `Sowcarpet`, `T. Nagar`, `Tambaram`, `Teynampet`, `Thiruvanmiyur`, `Thoraipakkam`, `Thousand Lights`, `Tondiarpet`, `Triplicane`, `Vadapalani`, `Valasaravakkam`, `Velachery`, `Vepery`, `Villivakkam`, `Virugambakkam`, `Washermenpet`, `West Mambalam`.

**B. Categories & Violations**
* **Traffic Violations** (Icon: `TrafficCone`)
    * `No Parking`, `One Way Violation`, `Riding on Footpath`, `Defective/Fancy Number Plate`, `Stopped on Zebra Cross`, `Triple Riding`, `Using Mobile Phone`, `Jumping Traffic Signal`, `Without Helmet`, `Stunt Riding`, `Footboard Travelling`, `Tinted Glass/Black Film`, `Abandoned Vehicle`, `Free Left Obstruction`.
* **Garbage & Debris** (Icon: `Trash2`)
    * `Overflowing Bin`, `Burning Garbage`, `Non-removal of Debris`, `Construction Waste Dumping`, `Improper Sweeping`.
* **Street Light** (Icon: `Lightbulb`)
    * `Non burning Street Light`, `Burning in daytime`, `Damaged Pole`, `Low Hanging Wires`, `Open Transformer Box`.
* **Roads & Footpath** (Icon: `Footprints`)
    * `Potholes`, `Damaged Road Surface`, `Illegal Parking on Footpath`, `Shop Encroachment on Footpath`, `Broken Manhole Cover`.
* **Water & Drainage** (Icon: `Droplets`)
    * `Water Stagnation`, `Sewage Overflow`, `Open Manhole`, `Illegal Sewage Discharge`.
* **Public Health** (Icon: `Activity`)
    * `Mosquito Menace`, `Street Dog Menace`, `Open Defecation`, `Illegal Slaughtering`.

**C. Rewards Catalog**
* `"Mayor of Chennai" Cap` (500 pts, Merch)
* `"Civic Sentinel" Badge` (200 pts, Merch)
* `A2B ₹100 Off Coupon` (300 pts, Coupon, Brand: A2B)
* `Murugan Idli Free Drink` (250 pts, Coupon, Brand: Murugan Idli)
* `Saravana Bhavan Coffee` (150 pts, Coupon, Brand: Saravana Bhavan)

## 5. Tech Stack & Frontend Engineering
**Framework:** Next.js 14 (App Router), TypeScript.
**Styling:** Tailwind CSS + Shadcn UI (Use `npx shadcn-ui@latest init` defaults).
**Icons:** `lucide-react` (Do not download external SVGs, use this library).

### UX Workflow 1: The "Smart" Frictionless Report
**Page:** `/app/page.tsx`
1.  **Hero:** Full-screen "Camera" view or large "Report" button.
2.  **Logic (SmartUploader.tsx):**
    * On file select, use `exif-js` to read GPS.
    * **IF GPS:** Auto-reverse-geocode (using Google Maps API or OpenStreetMap mock) -> Match against `zones` table -> Set State. Show "📍 T. Nagar Locked".
    * **IF NO GPS:** Open Full-screen Map (Leaflet or Google Maps) -> User taps pin -> Set State.
3.  **Selector (CategoryGrid.tsx):**
    * Display Categories as large 2x3 Grid Tiles.
    * On click, open a "Drawer" (Sheet component from Shadcn) with the Sub-Categories list.
    * *Traffic Special:* If Traffic is selected, show the specific violation icons.
4.  **Submit:** One click. Optimistic UI update ("Sent!"). Background upload.

### UX Workflow 2: Gamification (Redeem)
**Page:** `/app/redeem/page.tsx`
* **Tabs:** "Merch Store" | "Coupons".
* **Components:**
    * `PointsCard`: "🪙 450 Points".
    * `RewardCard`: Image (use placeholder), Title, Cost button.
* **Logic:** Simple check `if (userPoints >= itemCost)`.

### UX Workflow 3: Leaderboard
**Page:** `/app/leaderboard/page.tsx`
* **Logic:** Query DB for top user in *current detected zone*.
* **Display:** "Current Mayor of [Zone]: @User".

### UX Workflow 4: Admin Moderation (Added v1.1.0)
**Page:** `/app/admin/page.tsx`
* **Access:** Restricted via Middleware & `AdminButton`.
* **UI:** Tinder-style "Swipe" Interface.
    * Swipe **Right**: Approve Report.
    * Swipe **Left**: Reject Report.
* **History:** Drawer menu to view past actions and Undo.

### UX Workflow 5: User Authentication (Added v1.1.0)
**Feature:** NextAuth.js Integration
* **Providers:** Google, GitHub, Twitter, Apple, Facebook, Reddit, Demo User.
* **Flow:** 
    * User clicks "Sign In" or "Try Demo".
    * Redirected to Provider.
    * Callback handles session creation (JWT).
* **Profile:** `/app/profile/page.tsx` shows Stats, Badges, Level.

## 6. Backend Services (Python)
**File:** `/backend/twitter_bot.py`
**Dependencies:** `tweepy`, `python-dotenv`.
**Logic:**
* Function `process_report(report_id)`:
    * Fetch report details from DB.
    * **Smart Routing:**
        * Traffic -> `@ChennaiTraffic`
        * Water -> `@chnmetrowater`
        * Electricity -> `@TANGEDCO_Offcl`
        * Default -> `@chennaicorp`
    * **Hashtag:** Convert zone name to PascalCase hashtag (e.g., `#AnnaNagar`).
    * **Post:** Upload image + Text to Twitter.

## 7. Execution Plan
1.  **Scaffold:** Generate Next.js app structure.
2.  **Docker:** Write `docker-compose.yml`.
3.  **DB:** Write `setup.sql` with all seed data.
4.  **UI Components:** Build `SmartUploader`, `CategoryGrid`, `RewardCard`.
5.  **Pages:** Implement Home, Redeem, Leaderboard.
6.  **Script:** Write the Python bot.
7.  **Admin:** Implement Swipe UI for moderation.
8.  **Auth:** Implement NextAuth with Demo Mode.
9.  **Docs:** Generate Industry Standard Documentation.

## 8. Asset Instructions
* Use `lucide-react` for all icons (e.g., `TrafficCone`, `Trash2`, `Zap`).
* For placeholder images (Rewards/Reports), use standard placeholders (e.g., `https://placehold.co/600x400?text=Reward`).
* Ensure the UI uses a "Zinc" or "Slate" dark theme from Tailwind for that modern, sleek look.

## 9. Badges & Assets (Added)
* **Badges:** List defined in `badges.json`.
* **Generation:** Instructions in `BADGE_GENERATION.md` for `nanobanana` extension.