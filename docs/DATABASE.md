# Database Schema & Data Models

The project uses **PostgreSQL** with the **PostGIS** extension for geospatial features.

## ER Diagram (Conceptual)
`Users` (Managed by NextAuth) -> `Profiles` -> `Reports` -> `Zones` & `Categories`

## Tables

### 1. `zones`
Official administrative zones of Chennai.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique Zone ID |
| `name` | TEXT (Unique) | e.g., "T. Nagar", "Adyar" |
| `slug` | TEXT | URL-friendly version |

### 2. `complaint_categories`
Broad categories for issues.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique ID |
| `name` | TEXT | e.g., "Traffic Violations" |
| `icon_slug` | TEXT | Lucide icon name |

### 3. `complaint_sub_categories`
Specific violation types.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique ID |
| `category_id` | INT (FK) | Links to `complaint_categories` |
| `name` | TEXT | e.g., "No Parking" |
| `severity` | ENUM | `low`, `medium`, `critical` |

### 4. `reports`
The core civic issue report.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique Report ID |
| `image_url` | TEXT | Path to image in storage |
| `lat` | FLOAT | Latitude |
| `lng` | FLOAT | Longitude |
| `zone_id` | INT (FK) | Links to `zones` |
| `sub_category_id` | INT (FK) | Links to `complaint_sub_categories` |
| `description` | TEXT | Optional user description |
| `status` | ENUM | `pending`, `approved`, `rejected` |
| `user_id` | UUID | Links to Auth User ID |
| `created_at` | TIMESTAMP | Creation time |

### 5. `profiles`
Gamification stats for users.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique Profile ID |
| `user_id` | UUID (FK) | Links to Auth User |
| `current_points` | INT | Spendable points |
| `total_points` | INT | Lifetime XP |
| `badges` | JSONB | Array of earned badge IDs |

### 6. `rewards_catalog`
Items users can redeem.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique ID |
| `name` | TEXT | Item Name |
| `cost_points` | INT | Cost |
| `type` | ENUM | `merch`, `coupon` |

## Setup
The schema is initialized via `setup.sql`.
To reset the DB in development:
```bash
docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < setup.sql
```
