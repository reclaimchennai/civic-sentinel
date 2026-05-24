# Tasks

> **Status legend:** [x] shipped · [~] UI/mock built, backend wiring pending · [ ] not started

## Violation Reporting (Core)
- [x] EXIF Extraction — client-side via `exifr.gps()`, Pillow fallback in FastAPI
- [x] GCC Geo-fencing (GeoPandas point-in-polygon)
- [x] Ward & Zone Detection (`ward_zone_mapping.csv`)
- [x] Reverse Geocoding (LocationIQ)
- [x] Frontend Integration (SmartUploader, dual camera/file modes)
- [x] Gallery EXIF Stripping workaround (File Picker with `.heic`/`.jpg`)
- [x] Submit Report Logic — category submission to DB (`backend/main.py`)
- [x] Authenticated submission — SmartUploader forwards `session.user.id` to FastAPI; `reports.user_id` widened to TEXT to match NextAuth session IDs

## Admin Page
- [x] Data model for reports (`setup.sql`)
- [x] Swipe/vote UI (`src/app/admin/page.tsx`)
- [x] Approve/Reject/Undo persisted via `POST /api/admin/reports/[id]` with `{action: "approve" | "reject" | "undo"}`
- [x] Fetch pending via `GET /api/admin/reports?status=pending`
- [x] Admin gate via `src/lib/requireAdmin.ts` (401/403)
- [x] Responsive design
- [ ] Unit tests (API + UI)
- [ ] Integration tests (end-to-end approve/reject flow)
- [ ] Document admin API in `docs/API.md`

## User Authentication
- [x] NextAuth.js v5 configured (`src/auth.ts`)
- [x] OAuth: Google, Twitter, Apple, GitHub, Facebook, Reddit
- [x] Login/Signup UI
- [x] Profile page with stats/badges/level (real DB-backed)
- [x] Top-right user menu (`UserHeader.tsx`)
- [x] JWT session strategy
- [x] Session type augmentation (`src/types/next-auth.d.ts`)
- [x] Setup docs (`docs/AUTH_SETUP.md`)
- [x] User profile API endpoint (real query, real level math)

## Gamification (Octalysis) — Frontend
*See `docs/GAMIFICATION.md` for spec. Every feature below has a working UI AND a live DB-backed endpoint.*

### Phase 1: Core Engagement
- [x] Enhanced Level Progression (CD2) — `src/lib/levels.ts`, `LevelProgressBar.tsx`, real points from `profiles.current_points`
- [x] Challenge System (CD2) — `/challenges` page, `ChallengeCard`, real per-user progress
- [x] Enhanced Leaderboards (CD5) — timeframed by report count, all-time by points; rising stars
- [x] Streak Protection (CD8) — `StreakDisplay`, real streak counters from DB

### Phase 2: Community & Ownership
- [x] Zone Ownership (CD4) — `ZoneMayorCard`, mayorship surfaced on profile
- [x] Report Endorsements (CD5) — `/reports` browse page with endorse button, `POST/DELETE /api/reports/[id]/endorse`
- [x] Mission System (CD1) — `MissionBanner` + `POST /api/missions/[id]/join`
- [x] Limited-Time Events (CD6) — `EventBanner` + `event_rewards` JOIN

### Phase 3: Social & Discovery
- [~] Social Following (CD5) — `/social` page built; follow/unfollow endpoints not wired yet
- [x] Mystery Box Rewards (CD7) — `MysteryBoxReveal`, `POST /api/mystery-boxes/[id]/open` (weighted random reward, instant points/shield credit)
- [x] Milestone Celebrations (CD2) — fires on first submission via `MILESTONES.m1`
- [x] Impact Dashboard (CD1) — `/impact` page + aggregations over `reports`/`zones`/`categories` + 7-day trend

### Phase 4: Advanced
- [x] Guild System (CD5) — `/guilds`, `/guilds/[id]`, `POST /api/guilds/[id]/join` (respects `max_members`)
- [~] Profile Customization (CD4) — `/profile/customize` UI built; mutation endpoints not yet wired
- [~] Hidden Achievements (CD7) — `hiddenAchievements.ts` defined; detection logic not running yet
- [x] Onboarding Narrative (CD1) — `OnboardingFlow.tsx` with `useState` initializer (no setState-in-effect)

## Gamification — DB Triggers (automation)
- [x] `update_streak_on_report` — INSERT on `reports` updates `profiles.current_streak`/`longest_streak`/`last_active_date`
- [x] `award_points_on_approval` — UPDATE of `reports.status` to `approved` credits `profiles.current_points` +25 and `total_points_earned` +25
- [x] `sync_endorsement_counts` — INSERT/DELETE on `report_endorsements` keeps `reports.endorsement_count` and `profiles.total_endorsements` in sync
- [x] `reports.user_id TYPE TEXT` so the auth-id roundtrip works through all triggers

## Geo Data (in-flight)
*Source files now in `backend/data/`:*
- `Chennai_Traffic_Police_Boundaries_2025.geojson`
- `Chennai_Wards_Unified_2025.geojson`
- `jurisdiction_data.txt` (sub-division codes from PDF)
- [ ] Decide whether to attach traffic police sub-division to each report (alongside Ward/Zone)
- [ ] If yes: extend `is_in_gcc_boundary()` in `geo_utils.py` to also return sub-division, add `police_subdivision` column to `reports`

## Build Hygiene
- [x] All 12 lint errors cleared (0 errors)
- [x] Migrated `exif-js` → `exifr` (no `this`-binding, smaller bundle)
- [x] OnboardingFlow: `useState` initializer (no setState-in-effect cascade)
- [x] SmartUploader: `exifr.gps()`, sends `user_id` from session
- [x] React 19 purity rule fix in `redeem/page.tsx` (Date.now hoisted to mount)
- [x] `any` types replaced with proper interfaces in `auth.ts`, `CategoryGrid.tsx`, `page.tsx`, `profile/page.tsx`, `redeem/page.tsx`
- [ ] Address the 24 remaining cosmetic warnings (`<img>` → `next/image`, unused imports)

## Next Up (suggested)
- [ ] POST endpoints for follow/unfollow (`/social` page is awaiting them)
- [ ] Profile customization mutation endpoints (`/profile/customize` UI is awaiting them)
- [ ] Hidden achievement detection job
- [ ] Unit + integration tests
- [ ] Document the full API surface in `docs/API.md`
