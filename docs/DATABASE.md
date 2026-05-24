# Database Schema & Data Models

The project uses **PostgreSQL** with the **PostGIS** extension for geospatial features.

## Tables

### 1. `reports`
The core civic issue report table.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique Report ID |
| `image_url` | TEXT | Path to image (e.g., `uploads/image.jpg`) |
| `lat` | FLOAT | Latitude (Extracted from EXIF) |
| `lng` | FLOAT | Longitude (Extracted from EXIF) |
| `created_at` | TIMESTAMP | Creation time (Extracted from EXIF or Now) |
| `sub_category_id` | INT (FK) | Links to `complaint_sub_categories` |
| `status` | ENUM | `pending`, `approved`, `rejected` |
| `area` | TEXT | Reverse-geocoded locality (e.g., "T. Nagar") |
| `ward` | TEXT | GCC Ward Number (e.g., "133") |
| `zone_number` | INT | GCC Zone Number (e.g., 10) |
| `zone_name` | TEXT | GCC Zone Name (e.g., "KODAMBAKKAM") |
| `user_id` | UUID | Links to Auth User ID (Optional) |

### 2. `zones`
Official administrative zones of Chennai (Reference table).
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique Zone ID |
| `name` | TEXT | e.g., "T. Nagar" |
| `slug` | TEXT | URL-friendly version |

*Note: The backend now also uses `backend/data/ward_zone_mapping.csv` for logic mapping, but `zones` table remains as a reference.*

### 3. `complaint_categories`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique ID |
| `name` | TEXT | e.g., "Traffic Violations" |
| `icon_slug` | TEXT | Lucide icon name |

### 4. `complaint_sub_categories`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique ID |
| `category_id` | INT (FK) | Links to `complaint_categories` |
| `name` | TEXT | e.g., "No Parking" |
| `severity` | ENUM | `low`, `medium`, `critical` |

### 5. `profiles`
Gamification stats. One row per authenticated user; upserted on first API call via `src/lib/ensureProfile.ts`.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Internal profile UUID (referenced by gamification FKs) |
| `user_id` | TEXT (UNIQUE) | NextAuth session.user.id (provider sub, demo string, etc.) |
| `current_points` | INT | Spendable points |
| `total_points_earned` | INT | Lifetime XP |
| `badges` | JSONB | Array of earned badge IDs |
| `current_streak` | INT | Days in a row with at least 1 report |
| `longest_streak` | INT | Best streak ever |
| `last_active_date` | DATE | For streak computation |
| `streak_shields` | INT | Number of one-day freezes available |
| `title` | VARCHAR(100) | Displayed user title |
| `avatar_frame` | VARCHAR(50) | Cosmetic frame ID |
| `showcase_badges` | TEXT[] | Featured badge IDs |
| `guild_id` | UUID (FK) | Current guild membership |
| `total_endorsements` | INT | Sum of endorsements across user's reports |

## Gamification Tables

`backend/gamification_migration.sql` adds 22 tables covering the 8 Octalysis core drives:

| Table | Purpose |
| :--- | :--- |
| `missions`, `mission_participants` | Community-wide goals (CD1) |
| `challenges`, `user_challenge_progress` | Daily/weekly/seasonal tasks (CD2) |
| `events`, `event_rewards`, `event_participants` | Limited-time events with multipliers (CD6) |
| `guilds`, `guild_memberships`, `guild_challenges`, `guild_challenge_progress` | Team play (CD5) |
| `follows`, `activity_feed`, `feed_likes` | Social (CD5) |
| `report_endorsements` | Community validation (CD5) |
| `user_mystery_boxes` | Unpredictable rewards (CD7) |
| `streak_history` | Streak tracking (CD8) |
| `user_rewards` | Redeemed catalog items |
| `report_templates` | Power-user reusable templates (CD3) |
| `zone_ownership`, `zone_challenges` | Mayorship system (CD4) |
| `user_achievements` | Hidden achievements (CD7) |

It also ALTERs `profiles`, `reports`, and `rewards_catalog` to add gamification fields (see migration source).

## Setup
To initialize or reset the database:
```bash
docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < setup.sql
docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < backend/migration.sql
docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < backend/gamification_migration.sql
docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < backend/gamification_seed.sql
```