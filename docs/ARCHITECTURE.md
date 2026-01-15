# System Architecture

## Overview
Chennai Civic Sentinel is a Progressive Web Application (PWA) designed to facilitate frictionless civic reporting. It uses a **Next.js** frontend for user interaction and a **Python (FastAPI)** backend for geospatial processing and violation reporting, connected via a **PostgreSQL** database.

## Tech Stack

### Frontend & Application Layer
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Authentication:** NextAuth.js (v5 Beta)
- **State Management:** React Server Components + Client Hooks

### Backend Services (Python Microservice)
- **Framework:** FastAPI
- **Language:** Python 3.9+
- **Geospatial Processing:**
    - `piexif` & `Pillow` (EXIF Metadata Extraction)
    - `geopandas` & `shapely` (Geo-fencing & Point-in-Polygon checks)
- **Geocoding:** LocationIQ API (Reverse Geocoding)
- **Database Driver:** `psycopg2-binary`

### Data Layer
- **Database:** PostgreSQL 15 + PostGIS (Spatial Data)
- **Storage:** Local Filesystem (Prototype) / MinIO / S3 (Production)

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Proxy:** Caddy (Reverse Proxy & SSL)

## Directory Structure

```
/
├── backend/                # Python FastAPI Service
│   ├── data/               # GeoJSON & Mapping files
│   │   ├── Chennai_Wards.geojson
│   │   └── ward_zone_mapping.csv
│   ├── uploads/            # Temporary image storage
│   ├── main.py             # FastAPI Entry Point
│   ├── geo_utils.py        # Core Geospatial Logic
│   ├── db.py               # Database Interaction
│   └── requirements.txt    # Python dependencies
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # React Components
│   │   ├── SmartUploader.tsx # Frontend Integration
│   │   └── ...
│   └── ...
├── docker-compose.yml      # Service orchestration
└── next.config.ts          # Next.js Config (Rewrites /api/v1 -> Backend)
```

## Key Workflows

### 1. Violation Reporting (End-to-End)
1.  **User Action:** User uploads/snaps a photo via `SmartUploader`.
2.  **Frontend:** 
    *   Attempts to extract EXIF data client-side using `exif-js` (Primary).
    *   Sends `POST /api/v1/report` with image and extracted coordinates.
3.  **Backend (FastAPI):**
    *   **EXIF Extraction:** Extracts GPS (`lat`, `lng`) using `Pillow` as fallback if client-side failed.
    *   **Geo-Fencing:** Checks if coordinates are inside **GCC (Chennai) Limits** using `Chennai_Wards.geojson`.
    *   **Ward Detection:** Identifies the specific Ward polygon containing the point.
    *   **Zone Mapping:** Maps the Ward Number to a Zone Number/Name using `ward_zone_mapping.csv`.
    *   **Reverse Geocoding:** Fetches area name (e.g., "T. Nagar") from LocationIQ.
    *   **Storage:** Saves record to PostgreSQL `reports` table.
4.  **Response:** Returns Success + Location Details (Ward, Zone) or Error (Outside GCC).
5.  **Frontend:** Updates UI to show "Locked" state with Ward/Zone info.

## Known Limitations & Privacy Constraints

### Mobile Browser EXIF Stripping
Modern mobile browsers (Chrome on Android 13+, Samsung Internet, Safari on iOS) aggressively strip location metadata from images selected from the **Gallery** for privacy reasons.

*   **Behavior:** When `input type="file"` is used to pick an existing image, the browser scrubs the GPS tags or sets them to `NaN`/`0` before the file reaches the Javascript context or the server.
*   **Workaround:** 
    1.  **Camera Capture:** Using `capture="environment"` often bypasses this as the stream is direct.
    2.  **Hybrid Extraction:** We attempt extraction on both client-side (before upload) and server-side.
    3.  **Planned Feature:** A "Manual Pin Drop" map interface will be implemented as a fallback for users whose devices strip this data.

### 2. Moderation (Admin)
1.  Admin logs in and navigates to `/admin`.
2.  System fetches `pending` reports.
3.  Admin swipes **Right (Approve)** or **Left (Reject)**.
4.  Status updates in DB.

### 3. Authentication
1.  NextAuth.js handles OAuth (Google, Twitter, etc.) and Credentials (Demo).
2.  JWT strategy is used for sessions.
3.  Middleware protects `/admin` and `/profile` routes and blocks direct IP access.
