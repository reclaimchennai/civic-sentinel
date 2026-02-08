# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chennai Civic Sentinel is a PWA for civic violation reporting in Chennai. Users photograph violations, the system extracts GPS from EXIF data, validates the location is within Greater Chennai Corporation (GCC) limits, and identifies the Ward/Zone. Admins moderate reports via a swipe-based UI.

## Commands

### Frontend (Next.js)
- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run optimize-images` — Compress placeholder images

### Infrastructure
- `docker-compose up -d` — Start PostgreSQL (PostGIS), Redis, MinIO, and FastAPI backend
- `docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < setup.sql` — Initialize DB schema
- `docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < backend/migration.sql` — Run migrations

### Pre-commit Hook
Husky runs `npx secretlint "**/*"` on every commit to prevent secret leakage.

## Architecture

**Two-service architecture**: Next.js frontend + Python FastAPI backend, connected via Next.js rewrites (`/api/v1/*` → `http://127.0.0.1:8000/api/v1/*` configured in `next.config.ts`).

### Frontend (Next.js 16 / App Router)
- **Auth**: NextAuth.js v5 beta with JWT strategy (`src/auth.ts`). Supports OAuth (Google, GitHub, Reddit, Twitter/X, Apple, Facebook) and a Credentials-based demo account (always returns admin role). Providers use auto-inferred env vars (`AUTH_{PROVIDER}_ID`, `AUTH_{PROVIDER}_SECRET`). See `docs/AUTH_SETUP.md` for provider setup and `.env.example` for all required variables.
- **Session type augmentation**: `src/types/next-auth.d.ts` extends NextAuth types with `role` field.
- **Middleware** (`middleware.ts`): Protects `/admin`, `/profile`, `/redeem` routes. Enforces admin role for `/admin`. Blocks direct IP access in production.
- **UI Components**: Shadcn UI (Radix primitives) + Tailwind CSS v4. Components in `src/components/ui/`. Dark mode only (`html.dark`).
- **Key components**:
  - `SmartUploader.tsx` — Dual upload mode (camera capture vs file picker to preserve EXIF). Client-side EXIF extraction with `exif-js`, then uploads to backend.
  - `CategoryGrid.tsx` — Violation category selection.
  - Admin page (`src/app/admin/page.tsx`) — Swipe cards using `framer-motion` drag gestures.
- **Path alias**: `@/*` maps to `./src/*`.

### Backend (FastAPI / Python)
- `backend/main.py` — Single endpoint: `POST /api/v1/report`. Receives image + optional lat/lng, extracts EXIF as fallback, validates against GCC boundary, reverse geocodes, saves to DB.
- `backend/geo_utils.py` — Core geospatial logic: EXIF extraction (Pillow), GCC geo-fencing (GeoPandas + `data/Chennai_Wards.geojson`), ward-to-zone mapping (`data/ward_zone_mapping.csv`), reverse geocoding (LocationIQ API).
- `backend/db.py` — PostgreSQL connection and report insertion (psycopg2).
- Runs in Docker, built from `backend/Dockerfile`.

### Data Flow (Violation Report)
1. User captures/uploads image → client-side EXIF extraction → `POST /api/v1/report` with image + coords
2. Backend: server-side EXIF fallback → GCC boundary check (point-in-polygon against ward GeoJSON) → ward/zone lookup → reverse geocode → insert into `reports` table
3. Response includes ward, zone, area name → frontend shows "locked" location state

### Key Constraint: Mobile EXIF Stripping
Mobile browsers strip GPS metadata from gallery-selected images. The app works around this with two upload modes: camera capture (`capture="environment"`) and file picker (`accept=".jpg,.jpeg,.png,.heic,.heif"` to force File Manager over Gallery).

## Conventions

- **Commit messages**: Semantic format — `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- **Frontend code**: TypeScript, Tailwind CSS, Shadcn UI patterns
- **Git email for this repo**: `228286988+reclaimchennai@users.noreply.github.com`
- **Branch protection**: `main` is protected; use feature branches and PRs
- **Documentation updates**: New components → `docs/ARCHITECTURE.md`, new endpoints → `docs/API.md`, DB changes → `docs/DATABASE.md`
