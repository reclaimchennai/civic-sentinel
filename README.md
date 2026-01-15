# Chennai Civic Sentinel

> **Snap. Click. Done.**
> A frictionless, gamified PWA for civic reporting in Chennai.

![Status](https://img.shields.io/badge/Status-Prototype-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Stack](https://img.shields.io/badge/Stack-Next.js_15_|_PostGIS_|_FastAPI-black)

## Overview
Chennai Civic Sentinel is designed to solve the friction in current civic reporting systems. Users can report violations in under 10 seconds. The system features gamification, robust admin moderation, and automated geospatial verification (Geo-fencing & Ward detection) to ensure reports are valid and within Chennai city limits.

## ✨ Key Features
- **Frictionless Reporting:**
    - Auto-GPS extraction from images.
    - **GCC Geo-fencing:** Rejects reports outside Chennai.
    - **Smart Location:** Auto-detects Ward, Zone, and Area.
- **Admin Dashboard:** Tinder-style "Swipe" UI for approving/rejecting reports.
- **Gamification:** Points, Levels, Badges, and Zone Mayorships.
- **User Authentication:** OAuth (Google, Twitter, GitHub, etc.) and Demo Mode.
- **Dark Mode UI:** Modern "Cyberpunk/Civic-Tech" aesthetic.

## 📚 Documentation
- [System Architecture](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+

### Installation

1.  **Clone the Repo:**
    ```bash
    git clone https://github.com/reclaimchennai/civic-sentinel.git
    cd civic-sentinel
    ```

2.  **Start Infrastructure & Backend:**
    ```bash
    docker-compose up -d
    ```
    *This starts PostgreSQL, MinIO, and the **Python Backend Service**.*

3.  **Initialize Database:**
    ```bash
    # Run setup schema
    docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < setup.sql
    # Run backend migrations (for new columns)
    docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < backend/migration.sql
    ```

4.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

5.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [https://app.reclaimchennai.city](https://app.reclaimchennai.city) (or localhost:3000).

## 🎮 Usage Guide

### 1. Reporting an Issue
- Click the Camera icon or upload an image.
- **Note:** The image *must* contain GPS EXIF data and be within Chennai.
- Select the Category (e.g., "Traffic").
- Click **Submit**.

### 2. Admin Moderation
- Log in (use the **Try Demo Account** button).
- Click the **Shield Icon**.
- **Swipe Right** to Approve, **Swipe Left** to Reject.

## Security
- **Secret Scanning** enforced.
- **Branch Protection** on `main`.
- **RBAC:** Admin routes protected.
- **Host Validation:** Direct IP access blocked.

## License
MIT