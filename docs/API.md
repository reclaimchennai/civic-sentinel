# API Reference

> All responses are JSON. All endpoints that mutate state require an authenticated session (NextAuth JWT cookie). Errors come back as `{ "error": "string" }` with a non-2xx status.

The API has two physical surfaces:

- **FastAPI** (`http://127.0.0.1:8000` in dev, proxied via Next.js rewrites) — owns `/api/v1/report` and all heavy geospatial work.
- **Next.js route handlers** (`http://localhost:3000`) — own everything else. They connect to Postgres directly via the `pg` pool in `src/lib/db.ts`.

The split exists because the gamification endpoints all need NextAuth session context (`session.user.id`), which lives in Next.js.

---

## Auth

| Method | Path | Notes |
| :--- | :--- | :--- |
| ANY | `/api/auth/*` | NextAuth v5 routes (signin, callback, signout, csrf, session). |

Session shape (relevant for callers):

```ts
session.user = { id: string, name: string|null, email: string|null, role?: "admin" }
```

`session.user.id` is the NextAuth provider sub (Google sub, GitHub id, or `"demo-user-001"` for the demo credential). It is **not** a UUID; the DB stores it in `profiles.user_id TEXT`.

---

## Reports

### `POST /api/v1/report`
*(FastAPI)*

Submit a violation report.

Multipart form fields:
- `file` *(required)* — image (jpg/png/heic)
- `violation_type_id` *(required, int)* — `complaint_sub_categories.id`
- `lat`, `lng` *(optional, float)* — client-extracted EXIF coords; backend uses Pillow as fallback
- `user_id` *(optional)* — `session.user.id`; persisted as `reports.user_id` so triggers can credit the right profile

Response:
```json
{
  "status": "success",
  "message": "Violation reported successfully.",
  "data": {
    "report_id": "uuid",
    "area": "T. Nagar",
    "ward": "133",
    "zone_number": 10,
    "zone_name": "KODAMBAKKAM",
    "lat": 13.04, "lng": 80.23
  }
}
```

Error responses:
- `status: error` (HTTP 200, with explanatory message) when GPS is missing or coords are outside GCC.
- 500 on internal failure.

### `GET /api/reports?scope=<scope>&...`

| Scope | Description | Auth | Extra params |
| :--- | :--- | :--- | :--- |
| `city` (default) | All approved reports across Chennai | optional | — |
| `nearby` | Approved reports within `radius` meters of (`lat`,`lng`) | optional | `lat`, `lng` (required), `radius` (default 2000, max 50000) |
| `mine` | All statuses, owned by the session user | **required** (401 otherwise) | — |
| `all` | All approved reports (alias for `city`) | optional | — |

Common params: `status` (filter by `pending|approved|rejected`), `limit` (default 50, max 200).

Returns an array of:

```ts
{
  id, imageUrl, zone, category, status, createdAt,
  lat, lng, distanceMeters: number|null,
  authorId: string|null,
  counts: { upvotes, downvotes, comments, happy, neutral, angry },
  viewer: { upvoted, downvoted, reaction: "happy"|"neutral"|"angry"|null }
}
```

`distanceMeters` is computed via PostGIS `ST_Distance` on geography points; only populated for `scope=nearby`.

### `POST /api/reports/[id]/vote`

Body: `{ "value": "up" | "down" | "clear" }`

Idempotent. Switching direction clears the opposite vote. `clear` removes both. Returns the new `{ value, counts: { up, down } }`.

### `POST /api/reports/[id]/endorse`, `DELETE /api/reports/[id]/endorse`

Legacy single-direction endpoint kept for back-compat with the `/reports` browse page. Internally identical to `vote` with `value: "up"` / `value: "clear"`.

### `GET /api/reports/[id]/comments`

Public. Returns array of:
```ts
{ id, profileId, authorId, body, createdAt, editedAt: string|null }
```
Sorted oldest-first.

### `POST /api/reports/[id]/comments`

Body: `{ "body": "string (1-500 chars)" }`. Returns the created comment row.

### `DELETE /api/reports/[id]/comments/[commentId]`

Author or admin only. 404 if comment doesn't exist or caller isn't the author.

### `POST /api/reports/[id]/react`

Body: `{ "sentiment": "happy" | "neutral" | "angry" }`

Upsert — switching sentiment replaces the previous one (one reaction per user per report). Returns the new `{ sentiment, counts: { happy, neutral, angry } }`.

### `DELETE /api/reports/[id]/react`

Clears the caller's reaction.

---

## Admin

All `/api/admin/*` endpoints require `session.user.role === "admin"` (gate in `src/lib/requireAdmin.ts`). Returns 401 if unauthenticated, 403 if not admin.

### `GET /api/admin/reports?status=pending|approved|rejected&limit=N`

Returns the same report shape as `GET /api/reports` but with all statuses available.

### `POST /api/admin/reports/[id]`

Body: `{ "action": "approve" | "reject" | "undo" }`

`undo` returns the report to `pending`. The `award_points_on_approval` trigger fires on the `pending → approved` transition.

---

## User profile

### `GET /api/user/profile`

Auth required. Returns the full profile aggregate (stats, streak, level, mayorship, guild, active challenges, weekly activity). The route upserts a profile row on first call via `src/lib/ensureProfile.ts`.

### `PATCH /api/user/profile/customize`

Auth required. Body (any subset):
```ts
{
  title?: string,                  // 1-100 chars
  avatarFrame?: string,             // 1-50 chars
  showcaseBadges?: string[]         // up to 5 entries
}
```
Returns the persisted values.

---

## Gamification (read-only / global)

### `GET /api/missions/active`
Active community missions with cached `current_reports` and participant counts.

### `GET /api/challenges`
Returns `{ daily, weekly, seasonal }` arrays with per-user progress merged in if the caller is authenticated.

### `GET /api/events/active`
Active limited-time events with their reward thresholds.

### `GET /api/guilds`
All guilds with member counts and current active challenge.

### `GET /api/guilds/[id]`
Single guild detail with member list and `isMember` flag for the caller.

### `GET /api/leaderboard?timeframe=daily|weekly|monthly|allTime`
- `allTime` ranks by `profiles.total_points_earned`.
- Other timeframes rank by approved-report count in the window.
- Always returns `{ entries, risingStars }`.

### `GET /api/impact/stats`
Global aggregations: totals, resolution rate, top categories, last-7-day trend.

---

## Gamification (mutations)

All require auth.

### `POST /api/missions/[id]/join`
Inserts into `mission_participants` (idempotent via `ON CONFLICT`).

### `POST /api/guilds/[id]/join`
Inserts into `guild_memberships` and sets `profiles.guild_id`. Returns 409 if guild is full.

### `GET /api/mystery-boxes`
List the caller's boxes (opened and unopened).

### `POST /api/mystery-boxes/[id]/open`
Weighted-random reward by rarity. Points are credited immediately to `profiles.current_points/total_points_earned`; streak shields go to `profiles.streak_shields`. Returns the revealed reward.

### `POST /api/achievements/check`
Recomputes the caller's stats and unlocks any newly-qualifying hidden achievements. Returns `{ stats, newlyUnlocked, totalUnlocked }`. Idempotent.

---

## Social

### `POST /api/users/[id]/follow`, `DELETE /api/users/[id]/follow`
`[id]` is the target user's `session.user.id` (NextAuth sub). Self-follow is rejected with 400.

### `GET /api/feed?scope=trending|following|nearby&limit=N`
- `following` requires auth, returns activity from users the caller follows.
- `trending` and `nearby` return the latest global activity (no location semantics yet).
- Activity rows come from the `activity_feed` table (populated as features emit events).

### `POST /api/feed/[id]/like`, `DELETE /api/feed/[id]/like`
Toggles a like on an activity feed entry.

---

## Schema relationships you should know

- `profiles.user_id` is the lookup key (NextAuth session id, TEXT).
- `profiles.id` is the FK target used by every gamification table (UUID).
- `reports.user_id` is also TEXT (the session id) — the DB triggers join on `profiles.user_id = reports.user_id` to find which profile to credit.
- Three triggers fire automatically (`backend/triggers_migration.sql`):
  - INSERT report → `update_streak_on_report`
  - UPDATE report status to `approved` → `award_points_on_approval` (+25 points)
  - INSERT/DELETE on `report_endorsements` → `sync_endorsement_counts`
- Two triggers from the social layer (`backend/social_migration.sql`):
  - INSERT/DELETE on `report_downvotes` → `sync_downvote_count`
  - INSERT/DELETE on `report_comments` → `sync_comment_count`

## Error envelope

Every Next.js route returns `{ "error": "<human-readable string>" }` on non-2xx, with these conventional codes:

- `400` — validation failure (missing/invalid body or query)
- `401` — no session
- `403` — session exists but caller is not admin (admin endpoints only)
- `404` — referenced resource not found
- `409` — conflict (guild full, box already opened)
