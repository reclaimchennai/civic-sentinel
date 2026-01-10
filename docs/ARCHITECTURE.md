# System Architecture

## Overview
Chennai Civic Sentinel is a Progressive Web Application (PWA) designed to facilitate frictionless civic reporting. It uses a **Next.js** frontend for user interaction and a **Python** backend for social media automation, connected via a **PostgreSQL** database.

## Tech Stack

### Frontend & Application Layer
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Authentication:** NextAuth.js (v5 Beta)
- **State Management:** React Server Components + Client Hooks
- **Maps/Location:** EXIF.js (GPS extraction), Leaflet/Google Maps (planned)

### Backend Services
- **Database:** PostgreSQL 15 + PostGIS (Spatial Data)
- **Cache/Queue:** Redis (for job queues, planned)
- **Storage:** MinIO (Local S3 compatible) or Supabase Storage
- **Bot Automation:** Python (Tweepy) for Twitter integration

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions (Security & Linting)

## Directory Structure

```
/
├── backend/                # Python scripts for Twitter automation
│   ├── twitter_bot.py      # Main bot logic
│   └── requirements.txt    # Python dependencies
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── admin/          # Admin Dashboard (Swipe UI)
│   │   ├── api/            # API Route Handlers
│   │   ├── login/          # Auth Pages
│   │   ├── profile/        # User Profile & Stats
│   │   ├── globals.css     # Global styles & Tailwind
│   │   ├── layout.tsx      # Root layout & Providers
│   │   └── page.tsx        # Main Landing / Report Interface
│   ├── components/         # React Components
│   │   ├── ui/             # Shadcn UI primitives
│   │   ├── SmartUploader.tsx # Logic for image & GPS handling
│   │   ├── UserHeader.tsx    # Auth-aware navigation
│   │   └── ...
│   ├── lib/                # Utilities & Helpers
│   └── auth.ts             # NextAuth.js Configuration
├── docker-compose.yml      # Local dev infrastructure
├── setup.sql               # Database schema & seed data
└── next.config.ts          # Next.js Config
```

## Key Workflows

### 1. Frictionless Reporting (User)
1.  User lands on Homepage.
2.  Uploads image via `SmartUploader`.
3.  App extracts GPS metadata (EXIF).
4.  User selects Category/Sub-category.
5.  Report is saved to DB with status `pending`.

### 2. Moderation (Admin)
1.  Admin logs in and navigates to `/admin`.
2.  System fetches `pending` reports.
3.  Admin swipes **Right (Approve)** or **Left (Reject)**.
4.  Status updates in DB.
5.  (Future) Approved reports trigger Python bot.

### 3. Authentication
1.  NextAuth.js handles OAuth (Google, Twitter, etc.) and Credentials (Demo).
2.  JWT strategy is used for sessions.
3.  Middleware protects `/admin` and `/profile` routes.
