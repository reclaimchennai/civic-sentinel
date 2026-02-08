# Authentication Provider Setup Guide

This guide walks through obtaining OAuth credentials for each authentication provider supported by Chennai Civic Sentinel.

## Prerequisites

1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```
2. Generate an `AUTH_SECRET` (required for all providers):
   ```bash
   npx auth secret
   ```
   This appends `AUTH_SECRET` to your `.env` file automatically.

3. Set `AUTH_URL` in `.env`:
   - Development: `http://localhost:3000`
   - Production: `https://app.reclaimchennai.city`

> **Callback URL Pattern:** Every OAuth provider needs a callback/redirect URL. The format is:
> ```
> {AUTH_URL}/api/auth/callback/{provider}
> ```
> For local development, this is `http://localhost:3000/api/auth/callback/{provider}`.

---

## 1. Google

**Callback URL:** `http://localhost:3000/api/auth/callback/google`

### Steps

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Navigate to **APIs & Services → Credentials**.
4. Click **+ CREATE CREDENTIALS → OAuth client ID**.
5. If prompted, configure the **OAuth consent screen** first:
   - Choose **External** user type.
   - Fill in the app name ("Chennai Civic Sentinel"), user support email, and developer contact email.
   - On the **Scopes** step, add `email`, `profile`, and `openid`.
   - Add test users if the app is in "Testing" status.
   - Click **Save and Continue** through remaining steps.
6. Back on **Credentials**, click **+ CREATE CREDENTIALS → OAuth client ID**.
7. Select **Web application** as the application type.
8. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000` (development)
   - `https://app.reclaimchennai.city` (production)
9. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://app.reclaimchennai.city/api/auth/callback/google`
10. Click **Create**.
11. Copy the **Client ID** and **Client Secret**.

### Environment Variables
```env
AUTH_GOOGLE_ID=<your-client-id>.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=<your-client-secret>
```

---

## 2. GitHub

**Callback URL:** `http://localhost:3000/api/auth/callback/github`

### Steps

1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **OAuth Apps → New OAuth App**.
3. Fill in the form:
   - **Application name:** Chennai Civic Sentinel
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**.
5. On the app page, copy the **Client ID**.
6. Click **Generate a new client secret** and copy it immediately (it's only shown once).

### Environment Variables
```env
AUTH_GITHUB_ID=<your-client-id>
AUTH_GITHUB_SECRET=<your-client-secret>
```

> **Note:** For production, update the **Homepage URL** to `https://app.reclaimchennai.city` and add the production callback URL under the app settings.

---

## 3. Twitter / X

**Callback URL:** `http://localhost:3000/api/auth/callback/twitter`

### Steps

1. Go to the [X Developer Portal](https://developer.x.com/en/portal/dashboard).
2. Sign up for a developer account if you don't have one (Free tier is sufficient).
3. Create a new **Project** and then an **App** within it.
4. On the App settings page, go to **User authentication settings → Set up**.
5. Configure:
   - **App permissions:** Read (minimum)
   - **Type of App:** Web App, Automated App or Bot
   - **Callback URI / Redirect URL:** `http://localhost:3000/api/auth/callback/twitter`
   - **Website URL:** `http://localhost:3000`
6. Click **Save**.
7. Navigate to the **Keys and tokens** tab.
8. Under **OAuth 2.0 Client ID and Client Secret**, find/generate:
   - **Client ID**
   - **Client Secret**

### Environment Variables
```env
AUTH_TWITTER_ID=<your-oauth2-client-id>
AUTH_TWITTER_SECRET=<your-oauth2-client-secret>
```

> **Important:** Auth.js uses OAuth 2.0 for Twitter. Make sure you copy the **OAuth 2.0** credentials (not the API Key / API Key Secret which are OAuth 1.0a).

---

## 4. Facebook

**Callback URL:** `http://localhost:3000/api/auth/callback/facebook`

### Steps

1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Click **My Apps → Create App**.
3. Select **Authenticate and request data from users with Facebook Login** use case.
4. Choose **Consumer** app type. Click **Next**.
5. Enter:
   - **App name:** Chennai Civic Sentinel
   - **App contact email:** your email
6. Click **Create App**.
7. On the app dashboard, go to **App settings → Basic**:
   - Copy the **App ID** (this is your Client ID).
   - Click **Show** next to **App Secret** and copy it.
8. In the left sidebar, find **Facebook Login → Settings** (or use cases → Customize).
9. Under **Valid OAuth Redirect URIs**, add:
   - `http://localhost:3000/api/auth/callback/facebook`
   - `https://app.reclaimchennai.city/api/auth/callback/facebook`
10. Click **Save Changes**.

### Environment Variables
```env
AUTH_FACEBOOK_ID=<your-app-id>
AUTH_FACEBOOK_SECRET=<your-app-secret>
```

> **Note:** Facebook requires HTTPS for production redirect URIs. `localhost` is an exception for development. To make the app available to all users (not just test users), you need to complete **App Review** and set the app to **Live** mode.

---

## 5. Apple

**Callback URL:** `https://app.reclaimchennai.city/api/auth/callback/apple`

Apple Sign In is more complex than other providers. It requires an Apple Developer Program membership ($99/year).

### Prerequisites
- An [Apple Developer Program](https://developer.apple.com/programs/) membership (paid).
- Apple Sign In **does not work with `http://localhost`**. You need either a production domain with HTTPS or a tunneling service (e.g., ngrok) for local testing.

### Steps

#### A. Register an App ID
1. Go to [Apple Developer → Identifiers](https://developer.apple.com/account/resources/identifiers/list).
2. Click **+** to register a new identifier.
3. Select **App IDs** → **App** type → Continue.
4. Fill in:
   - **Description:** Chennai Civic Sentinel
   - **Bundle ID:** (Explicit) `city.reclaimchennai.app`
5. Under **Capabilities**, check **Sign In with Apple**.
6. Click **Continue** → **Register**.

#### B. Create a Services ID
1. Go back to **Identifiers** → Click **+**.
2. Select **Services IDs** → Continue.
3. Fill in:
   - **Description:** Chennai Civic Sentinel Web Auth
   - **Identifier:** `city.reclaimchennai.app.auth` (this is your Client ID)
4. Click **Continue** → **Register**.
5. Click on the newly created Services ID.
6. Check **Sign In with Apple** → Click **Configure**.
7. Set:
   - **Primary App ID:** Select the App ID created in Step A.
   - **Domains:** `app.reclaimchennai.city`
   - **Return URLs:** `https://app.reclaimchennai.city/api/auth/callback/apple`
8. Click **Save** → **Continue** → **Save**.

#### C. Create a Private Key
1. Go to [Keys](https://developer.apple.com/account/resources/authkeys/list) → Click **+**.
2. **Key Name:** Chennai Civic Sentinel Auth Key
3. Check **Sign In with Apple** → Click **Configure**.
4. Select your **Primary App ID** → **Save**.
5. Click **Continue** → **Register**.
6. **Download** the `.p8` key file. Save it securely — it can only be downloaded once.
7. Note the **Key ID** displayed on the page.

#### D. Generate the Client Secret
Apple's client secret is a JWT signed with your private key. You need to generate it. Use this Node.js script:

```bash
# Install jsonwebtoken if not available
npm install -g jsonwebtoken
```

Create a file `scripts/generate-apple-secret.js`:
```js
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("path/to/AuthKey_XXXXXXXXXX.p8");
const teamId = "YOUR_TEAM_ID";      // Found in Apple Developer account membership
const clientId = "city.reclaimchennai.app.auth"; // The Services ID
const keyId = "YOUR_KEY_ID";        // From step C.7

const token = jwt.sign({}, privateKey, {
  algorithm: "ES256",
  expiresIn: "180d",
  audience: "https://appleid.apple.com",
  issuer: teamId,
  subject: clientId,
  keyid: keyId,
});

console.log("Apple Client Secret (valid 180 days):");
console.log(token);
```

Run it:
```bash
node scripts/generate-apple-secret.js
```

### Environment Variables
```env
AUTH_APPLE_ID=city.reclaimchennai.app.auth
AUTH_APPLE_SECRET=<generated-jwt-secret>
```

> **Important:** The Apple client secret JWT expires (max 180 days). You must regenerate and rotate it before expiry.

---

## 6. Reddit

**Callback URL:** `http://localhost:3000/api/auth/callback/reddit`

### Steps

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps).
2. Scroll to the bottom and click **create another app...** (or "are you a developer? create an app...").
3. Fill in the form:
   - **name:** Chennai Civic Sentinel
   - **App type:** Select **web app**
   - **description:** (optional) Civic reporting platform
   - **about url:** `http://localhost:3000`
   - **redirect uri:** `http://localhost:3000/api/auth/callback/reddit`
4. Click **create app**.
5. After creation, find your credentials:
   - **Client ID:** The string shown under the app name (below "web app").
   - **Client Secret:** Labeled "secret" on the page.

### Environment Variables
```env
AUTH_REDDIT_ID=<your-client-id>
AUTH_REDDIT_SECRET=<your-client-secret>
```

> **Note:** For production, go back to your app settings, click **edit**, and update the **redirect uri** to `https://app.reclaimchennai.city/api/auth/callback/reddit`.

---

## Testing Providers Locally

1. Ensure Docker services are running:
   ```bash
   docker-compose up -d
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Visit `http://localhost:3000/login` and test each configured provider.

4. The **Demo User** button always works without any OAuth setup — use it for testing non-auth features.

## Enabling a Subset of Providers

If you only want to enable some providers, you can leave the unused `AUTH_*_ID` and `AUTH_*_SECRET` variables empty in `.env`. The login page will still show all buttons, but clicking an unconfigured provider will result in an OAuth error. To hide unconfigured providers from the UI, remove them from the `providers` array in `src/auth.ts` and the corresponding button in `src/app/login/page.tsx`.

## Production Checklist

- [ ] All callback URLs updated to production domain (`https://app.reclaimchennai.city`)
- [ ] `AUTH_URL` set to `https://app.reclaimchennai.city`
- [ ] `AUTH_SECRET` is a strong, unique value (not the development one)
- [ ] Apple client secret JWT is fresh (not expired)
- [ ] Facebook app is in **Live** mode (not Development)
- [ ] Google OAuth consent screen is published (not in Testing mode)
- [ ] Twitter app has correct OAuth 2.0 settings
- [ ] All secrets stored securely (not committed to git)
