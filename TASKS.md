# Tasks

## Admin Page Feature
- [x] Design data model for reports
- [ ] Develop API endpoints for report management (Fetch Pending, Approve, Reject, Undo)
- [x] Implement frontend UI for report listing and details (Swipe/Vote Interface)
- [x] Integrate approval/disapproval actions (Client-side logic done)
- [ ] Write unit tests for API and UI components
- [ ] Add integration tests for end-to-end workflow
- [x] Ensure responsive design for admin page
- [ ] Document API endpoints and UI interactions

## User Authentication Feature
- [x] Install and Configure NextAuth.js (v5)
- [x] Implement OAuth Providers (Google, Twitter, Apple, GitHub, Facebook, Reddit)
- [x] Design Auth UI (Login/Signup Pages)
- [x] Create User Profile Page (Stats, Badges, Level)
- [x] Add Top-Right User Icon/Menu
- [x] Define API endpoints for user profile
- [x] Implement JWT token strategy

## Gamification (Octalysis Framework)
*See `docs/GAMIFICATION.md` for detailed specifications.*

### Phase 1: Core Engagement
- [ ] **Enhanced Level Progression (CD2):** Implement `src/lib/levels.ts` and `LevelProgressBar.tsx`. Update DB Schema.
- [ ] **Challenge System (CD2):** Create `challenges` table and UI for Daily/Weekly challenges.
- [ ] **Enhanced Leaderboards (CD5):** Build global/zone leaderboards with timeframes.
- [ ] **Streak Protection (CD8):** Implement streak tracking, freezing, and notification logic.

### Phase 2: Community & Ownership
- [ ] **Zone Ownership (CD4):** Enhanced Mayorship system with "Defenders" and "Challengers".
- [ ] **Report Endorsements (CD5):** Allow users to upvote/endorse reports.
- [ ] **Mission System (CD1):** "Chennai Guardian" missions with progress bars.
- [ ] **Limited-Time Events (CD6):** Flash missions and seasonal events logic.

### Phase 3: Social & Discovery
- [ ] **Social Following (CD5):** Follow users, activity feed (`/social/feed`).
- [ ] **Mystery Box Rewards (CD7):** Random rewards for achievements.
- [ ] **Milestone Celebrations (CD2):** Full-screen animations for big achievements.
- [ ] **Impact Dashboard (CD1):** Visual stats of real-world impact (potholes fixed, etc.).

### Phase 4: Advanced Features
- [ ] **Guild System (CD5):** Create teams/guilds with shared goals.
- [ ] **Profile Customization (CD4):** Avatars, frames, and banners.
- [ ] **Hidden Achievements (CD7):** Secret badges based on patterns.
- [ ] **Onboarding Narrative (CD1):** "Sentinel's Creed" interactive intro.

## Violation Reporting (Current)
- [x] EXIF Extraction (Backend - Pillow)
- [x] GCC Geo-fencing (Python/GeoPandas)
- [x] Ward & Zone Detection
- [x] Reverse Geocoding (LocationIQ)
- [x] Frontend Integration (SmartUploader)
- [x] **Solved:** Gallery EXIF Stripping (via File Picker)
- [ ] Submit Report Logic (Finalizing category submission to DB)
