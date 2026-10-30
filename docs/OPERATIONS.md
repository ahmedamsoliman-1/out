# Yella Out operations guide

## Local development

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
pnpm dev
```

The web app intentionally starts with clearly-labelled editorial demo records while Firestore is not configured. Do not publish them as real listings.

## Firebase

1. Create separate Firebase projects for development and production.
2. Enable Email/Password and selected social providers in Firebase Authentication.
3. Deploy `firebase/firestore.rules` and `firebase/firestore.indexes.json`.
4. Assign editorial claims only with the Admin SDK: `setCustomUserClaims(uid, { role: "editor" })` or `{ role: "admin" }`.
5. Set the server-only Firebase Admin variables in Vercel. Users must refresh their ID token after claim assignment.

The Web and Expo Firebase client configuration is public by design. Firebase Admin credentials are never sent to either client.

## Vercel and ingestion

Deploy `apps/web` to Vercel. Set all values from `apps/web/.env.example`; use a new, high-entropy `INGESTION_CRON_SECRET` in every environment.

Invoke `POST /api/internal/ingestion/:provider` from Vercel Cron, QStash, or GitHub Actions with `x-yella-ingestion-secret`. The included route is a secure ingestion boundary, not a scraper: implement a provider adapter only after its API/feed licence and use are approved. Use an Upstash Redis lock key `lock:ingestion:{provider}` with a 10-minute TTL before provider fetches.

Vercel’s free-tier cron/service limits make it suitable for low-frequency, non-critical syncs. Keep manual editorial publishing available; use QStash or a paid scheduler when sync reliability becomes product-critical.

## Data handling

- Never auto-publish organizer submissions or provider data.
- Preserve source URL, provider ID, payload hash, and ingest timestamps in `eventSources`.
- Deduplicate provider ID first, then canonical booking URL, then normalized title + venue + time-window candidates.
- Mark ended events `expired`; archive after 90 days. Retain only the minimum rejected-submission contact data required by policy.
- Ensure every image is owned, licensed, or organizer-provided before publishing. The demo image placeholders must be replaced with verified rights metadata.

## API verification

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/events
curl http://localhost:3000/api/events/alserkal-after-dark
```

Authenticated BFF requests send `Authorization: Bearer <Firebase-ID-token>`. Admin routes additionally require an `editor` or `admin` role claim.
