# Chennai Civic Sentinel

> **Snap. Click. Done.**
> A frictionless, gamified PWA for civic reporting in Chennai.

![Status](https://img.shields.io/badge/Status-Prototype-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Stack](https://img.shields.io/badge/Stack-Next.js_15_|_PostGIS_|_Python-black)

## Overview
Chennai Civic Sentinel is designed to solve the friction in current civic reporting systems. Users can report violations in under 10 seconds. The system features gamification to encourage participation and a robust admin dashboard for vetting reports before they are publicly broadcasted to authorities via Twitter.

## ✨ Key Features
- **Frictionless Reporting:** Auto-GPS extraction from images.
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
- Python 3.9+

### Installation

1.  **Clone the Repo:**
    ```bash
    git clone https://github.com/reclaimchennai/civic-sentinel.git
    cd civic-sentinel
    ```

2.  **Start Infrastructure:**
    ```bash
    docker-compose up -d
    ```

3.  **Initialize Database:**
    ```bash
    docker exec -i civic-sentinel-db-1 psql -U postgres -d chennai_sentinel < setup.sql
    ```

4.  **Install Dependencies:**
    ```bash
    npm install
    ```

5.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## 🎮 Usage Guide

### 1. Reporting an Issue
- Go to the Home Page.
- Click the Camera icon or upload an image.
- Select the Category (e.g., "Traffic").
- Click **Submit**.

### 2. Admin Moderation
- Log in (use the **Try Demo Account** button if testing).
- Click the **Shield Icon** in the bottom navigation.
- **Swipe Right** to Approve.
- **Swipe Left** to Reject.
- Use the Hamburger menu to undo actions.

### 3. Demo Mode
- On the Login page, click **"Try Demo Account"**.
- This logs you in as a pre-configured Level 5 user with badges and history.

## Security
This repository enforces:
- **Secret Scanning** (Gitleaks) on every push.
- **Branch Protection** on `main`.
- **Pre-commit hooks** (Husky) for local linting.

## License
MIT
