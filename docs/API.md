# API Documentation

## Authentication Endpoints

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
  "email": "user@example.com",
  "level": 5,
  "points": 450,
  "nextLevelPoints": 1000,
  "reports": 12,
  "approved": 10,
  "badges": ["Early Adopter", "Night Owl"],
  "mayorship": "T. Nagar",
  "bio": "User bio text..."
}
```

**Response (401 Unauthorized):**
```json
{ "error": "Unauthorized" }
```

---

## Report Endpoints (Planned/Pending)

### `POST /api/reports` (Planned)
Submit a new report.
- **Body:** `{ image, lat, lng, zone_id, sub_category_id, description }`

### `GET /api/admin/reports` (Planned)
Fetch pending reports for the Admin Dashboard.
- **Query Params:** `?status=pending&limit=10`

### `PATCH /api/admin/reports/:id` (Planned)
Approve or Reject a report.
- **Body:** `{ "status": "approved" | "rejected" }`

---

## Error Handling
Standard HTTP Status Codes are used:
- `200`: Success
- `400`: Bad Request (Validation Error)
- `401`: Unauthorized (Not logged in)
- `403`: Forbidden (Admin only access)
- `500`: Internal Server Error
