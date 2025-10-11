# MapQuest Full

**Next.js 14 + Supabase Auth + Neon Postgres + MapLibre + Admin + Cron + SEO**

## Quickstart
```bash
pnpm i
cp .env.example .env.local   # fill Supabase + Neon
pnpm db:setup                # creates schema & seed on Neon
pnpm dev
```

### Deploy
- Push to GitHub → Import on Vercel
- Set env vars on Vercel (same as `.env.local`)
- Cron is configured in `vercel.json` to POST `/api/admin/cron/unlock-scan` daily at 04:00 UTC

### Notes
- Domain is preset to **https://remembertogo.com** in SEO (robots/sitemap). Change `SITE_URL` if needed.
- Admin access: add your email to `ADMIN_EMAILS` (comma-separated).

### Stack
- Next.js 14 (App Router)
- Supabase Auth (OAuth + JWT)
- Neon Postgres for app data
- MapLibre for maps
- Zod for env validation
- TailwindCSS for UI
- Vercel (hosting + cron)

### Security
- CSP/headers via `vercel.json`
- Strict TS, Zod-validated env
- DB constraints & indexes

© 2025 MapQuest
