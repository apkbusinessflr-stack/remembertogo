# RememberToGo – Cleanup PR (2025‑10‑12)

This PR removes demo/duplicate endpoints, unused `types/*` files, fixes env usage for DB, simplifies headers config, and tightens copy for the homepage.

## Changes
- **Remove**: `app/api/ping/route.ts` and `app/api/route.ts` (redundant health/ping duplicates).
- **Remove**: `types/place.ts`, `types/tailwind.config.ts`, `types/tsconfig.json` (unused / duplicate configs).
- **Fix**: `lib/db.ts` now uses `env.DATABASE_URL` wrapper.
- **Fix**: `app/api/interest/route.ts` imports via `@/*` alias.
- **Cleanup**: `next.config.mjs` no longer duplicates `Referrer-Policy` header already set in `vercel.json`.
- **Remove**: zero‑byte `public/favicon.ico` to prevent broken asset.
- **Copy**: homepage title simplified to “RememberToGo”.

## Post‑merge checklist
1. Set Vercel envs: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`, `CRON_SECRET`, `ADMIN_EMAILS`, `INTEREST_THRESHOLD=25`, `INTEREST_WINDOW_DAYS=30`, `SITE_URL=https://remembertogo.com`, `NEXT_PUBLIC_MAPTILER_KEY`.
2. Run SQL migrations from `scripts/sql/*.sql` (in order 001→004) on Neon.
3. Verify `/api/health` returns `{ ok: true }` in prod.
4. Confirm cron is scheduled: `vercel.json` path `/api/admin/cron/unlock-scan` at `0 4 * * *`.
5. (Optional) add a real `public/favicon.ico`.
