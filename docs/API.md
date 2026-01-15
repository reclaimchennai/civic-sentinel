# API Documentation

## Violation Reporting (Backend Service)

The backend service runs on port `8000` (internal) and is accessible via `/api/v1/*` proxy from the frontend.

### `POST /api/v1/report`
Submit a new violation report. Performs server-side validation, geospatial analysis, and storage.

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body:**
    - `file`: The image file (JPEG/PNG). **Must contain GPS EXIF metadata.**
    - `violation_type_id`: Integer ID of the violation category (e.g., 1 for Traffic).

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Violation reported successfully.",
  "data": {
    "report_id": "uuid-string",
    "area": "T. Nagar",
    "ward": "133",
    "zone_number": 10,
    "zone_name": "KODAMBAKKAM",
    "lat": 13.0418,
    "lng": 80.2341
  }
}
```

**Error Responses:**
- **400 Bad Request:** Missing file or invalid data.
- **200 OK (Logical Error):** (The API currently returns 200 with status="error" for logic failures to handle frontend gracefully, subject to change)
    - `{"status": "error", "message": "No EXIF metadata found..."}`
    - `{"status": "error", "message": "Location is outside Greater Chennai Corporation limits."}`

---

## Authentication Endpoints (NextAuth.js)

### `GET/POST /api/auth/[...nextauth]`
Handled automatically by **NextAuth.js**.
- **Purpose:** Manages OAuth flows (login/callback), session retrieval, and sign-out.
- **Providers:** Google, GitHub, Twitter, Apple, Facebook, Reddit, Credentials (Demo).

---

## User Endpoints

### `GET /api/user/profile`
Fetches the current user's profile and gamification stats.

**Request Headers:**
- `Cookie`: Valid `authjs.session-token`

**Response (200 OK):**
```json
{
  "id": "user-uuid",
  "name": "User Name",
  "level": 5,
  "points": 450,
  ...
}
```