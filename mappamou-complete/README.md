# Mappamou — COMPLETE Skeleton (Next.js 14 + TS)

Built: 2025-10-14 17:26 UTC

## Quick Start
```bash
npm i
npm run dev
# http://localhost:3000
```

## Deploy (Vercel)
1. Push to GitHub → Import on Vercel.
2. Settings → Node.js Version: **20.x**.
3. Env: `NEXT_PUBLIC_SITE_URL=https://YOUR.vercel.app` (Production & Preview).
4. Deploy. No DB/keys required.

## What’s inside
- App Router routes: home, lists, place, map, profile, feed.
- Production pages: privacy, terms, cookies, licensing, contact, report, 404/500.
- Countries/categories hubs + sitemap shards.
- OG image endpoints.
- Consent banner & ad placeholders (no CLS) + static `public/ads.txt`.
- Type-safe API stubs (zod).

## Next Steps
- Replace `lib/db.ts` with Supabase queries (when ready).
- Swap map tiles with your provider.
- Configure Funding Choices (Consent Mode v2).
- Add monitoring (Sentry), and tests.
