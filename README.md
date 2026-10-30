# Yella Out

Curated, Dubai-first recommendations for plans worth leaving home for.

## Quick start

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Open `http://localhost:3000`. The app runs with rich editorial seed data until Firebase variables are configured.

## Apps

- `apps/web` — Next.js discovery product, editorial dashboard and BFF.
- `apps/mobile` — Expo Router client consuming the same BFF contracts.
- `packages/types` — shared Zod schemas, types and API contracts.
- `packages/config` — editorial taxonomy and Dubai area configuration.

See `docs/OPERATIONS.md` for Firebase, Vercel, Upstash, ingestion and deployment setup.
