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
Gamification stats.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique Profile ID |
| `user_id` | UUID (FK) | Links to Auth User |
| `current_points` | INT | Spendable points |
| `total_points` | INT | Lifetime XP |
| `badges` | JSONB | Array of earned badge IDs |

## Setup
To initialize or reset the database:
```bash
docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < setup.sql
docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < backend/migration.sql
```