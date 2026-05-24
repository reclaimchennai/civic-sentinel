# Tasks

> **Status legend:** [x] shipped · [~] UI/mock built, backend wiring pending · [ ] not started

## Violation Reporting (Core)
- [x] EXIF Extraction (Pillow + client-side `exif-js`)
- [x] GCC Geo-fencing (GeoPandas point-in-polygon)
- [x] Ward & Zone Detection (`ward_zone_mapping.csv`)
- [x] Reverse Geocoding (LocationIQ)
- [x] Frontend Integration (SmartUploader, dual camera/file modes)
- [x] Gallery EXIF Stripping workaround (File Picker with `.heic`/`.jpg`)
- [x] Submit Report Logic — category submission to DB (`backend/main.py:65`)

## Admin Page
- [x] Data model for reports (`setup.sql`)
- [x] Swipe/vote UI (`src/app/admin/page.tsx`)
- [x] Client-side approve/reject actions
- [x] Responsive design
- [ ] **API: report management endpoints** (Fetch Pending, Approve, Reject, Undo) — currently client-only, no persistence
- [ ] Unit tests (API + UI)
- [ ] Integration tests (end-to-end approve/reject flow)
- [ ] Document admin API in `docs/API.md`

## User Authentication
- [x] NextAuth.js v5 configured (`src/auth.ts`)
- [x] OAuth: Google, Twitter, Apple, GitHub, Facebook, Reddit
- [x] Login/Signup UI
- [x] Profile page with stats/badges/level
- [x] Top-right user menu (`UserHeader.tsx`)
- [x] JWT session strategy
- [x] Session type augmentation (`src/types/next-auth.d.ts`)
- [x] Setup docs (`docs/AUTH_SETUP.md`)
- [x] User profile API endpoint

## Gamification (Octalysis)
*See `docs/GAMIFICATION.md` for spec. UIs built with mock data — DB wiring is the remaining work.*

### Phase 1: Core Engagement
- [~] Enhanced Level Progression (CD2) — `src/lib/levels.ts`, `LevelProgressBar.tsx` built
- [~] Challenge System (CD2) — `/challenges` page, `ChallengeCard`, mock API
- [~] Enhanced Leaderboards (CD5) — filters, rising stars, zone mayors built
- [~] Streak Protection (CD8) — `StreakDisplay`, `streaks.ts` built

### Phase 2: Community & Ownership
- [~] Zone Ownership (CD4) — `ZoneMayorCard`, `zones.ts` built
- [~] Report Endorsements (CD5) — schema in migration, UI not wired into report cards
- [~] Mission System (CD1) — `MissionBanner`, mock API, home integration
- [~] Limited-Time Events (CD6) — `EventBanner`, `events.ts`, mock API

### Phase 3: Social & Discovery
- [~] Social Following (CD5) — `/social` page built
- [~] Mystery Box Rewards (CD7) — `MysteryBoxReveal`, mock API, integrated in `/redeem`
- [~] Milestone Celebrations (CD2) — `MilestoneCelebration` component built
- [~] Impact Dashboard (CD1) — `/impact` page + mock API

### Phase 4: Advanced
- [~] Guild System (CD5) — `/guilds`, `/guilds/[id]`, mock API
- [~] Profile Customization (CD4) — `/profile/customize` built
- [~] Hidden Achievements (CD7) — `hiddenAchievements.ts` built
- [~] Onboarding Narrative (CD1) — `OnboardingFlow.tsx` built

### Gamification — Backend Integration (the real remaining work)
- [ ] Run `backend/gamification_migration.sql` against PostgreSQL
- [ ] Wire `/api/missions/active` to `missions` table
- [ ] Wire `/api/challenges` to `challenges` + `user_challenge_progress`
- [ ] Wire `/api/leaderboard` to `profiles` (aggregate by points/reports)
- [ ] Wire `/api/events/active` to `events` table
- [ ] Wire `/api/guilds` and `/api/guilds/[id]` to `guilds` + `guild_memberships`
- [ ] Wire `/api/impact/stats` to aggregate over `reports` table
- [ ] Wire `/api/mystery-boxes` to `user_mystery_boxes` with open/reveal logic
- [ ] Streak update job: increment/break on report submission
- [ ] Endorsement endpoint + UI on report cards
- [ ] Level-up + milestone triggers on report approval

## Geo Data (in-flight)
*Source files now in `backend/data/`:*
- `Chennai_Traffic_Police_Boundaries_2025.geojson`
- `Chennai_Wards_Unified_2025.geojson`
- `jurisdiction_data.txt` (sub-division codes from PDF)
- [ ] Decide whether to attach traffic police sub-division to each report (alongside Ward/Zone)
- [ ] If yes: extend `is_in_gcc_boundary()` in `geo_utils.py` to also return sub-division, add `police_subdivision` column to `reports`

## Build Hygiene
- [ ] Fix 12 lint errors (`OnboardingFlow.tsx` setState-in-effect, `SmartUploader.tsx` `any`/`this` usage)
- [ ] Consider migrating `exif-js` → `exifr` (modern, no `this`-binding, smaller bundle)
