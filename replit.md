# Salatak / صلاتك

Salatak is a mobile Islamic companion for prayer times, Quran reading, daily duas, Hijri dates, and personal worship tracking.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/salatak/app/(tabs)/index.tsx` — prayer dashboard and daily home experience
- `artifacts/salatak/app/(tabs)/quran.tsx` — searchable Quran index and reader
- `artifacts/salatak/app/(tabs)/duas.tsx` — categorized daily supplications
- `artifacts/salatak/app/(tabs)/more.tsx` — worship tools, rak'ah counter, and settings
- `artifacts/salatak/providers/SalatakProvider.tsx` — AsyncStorage-backed local persistence
- `artifacts/salatak/constants/colors.ts` — Salatak color tokens

## Architecture decisions

- The first mobile build is frontend-only and uses AsyncStorage for bookmarks, prayer completion, and rak'ah count.
- Prayer times and Quran/dua content are local seed data so the first-use experience works without network setup.
- The app uses the Expo Router tab layout with a native liquid-glass path on supported iOS versions and a classic fallback elsewhere.

## Product

- Prayer dashboard with next-prayer countdown presentation, Beirut location, Hijri date, and tappable completion tracking.
- Searchable Quran surah index with a focused reader view and local bookmarks.
- Daily dua categories with saved items and read feedback.
- Hijri calendar summary, rak'ah counter, saved item count, prayer notifications status, and location settings surface.

## User preferences

- The product is named “Salatak / صلاتك” and is inspired by the feature set of the user's reference app, not a pixel-for-pixel copy.

## Gotchas

- The Expo workflow may print a React Native DevTools `libglib-2.0.so.0` warning in this environment; Metro can still start and serve the preview.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
