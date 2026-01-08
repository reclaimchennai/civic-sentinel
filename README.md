# Chennai Civic Sentinel

Frictionless Civic Reporting PWA.

## Getting Started

### 1. Database & Infrastructure
Spin up the local services:
```bash
docker-compose up -d
```

Initialize the database:
```bash
# Wait for DB to be ready, then:
docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < setup.sql
```

### 2. Frontend
Install dependencies and start development server:
```bash
npm install
npm run dev
```

### 3. Backend Bot
Install Python dependencies and run the bot (requires environment variables for Twitter):
```bash
cd backend
pip install -r requirements.txt
python twitter_bot.py [report_id]
```

## Tech Stack
- **Frontend:** Next.js 15, Tailwind CSS, Shadcn UI, Lucide Icons.
- **Backend:** Python (Tweepy) for Twitter integration.
- **Database:** PostgreSQL + PostGIS.
- **Tools:** EXIF.js for GPS extraction.