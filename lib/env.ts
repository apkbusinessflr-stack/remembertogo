// lib/env.ts  (MINIMAL, GREEN BUILD)
export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  NEXT_PUBLIC_MAPTILER_KEY: process.env.NEXT_PUBLIC_MAPTILER_KEY ?? "",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  CRON_SECRET: process.env.CRON_SECRET ?? "dev-cron",
  ADMIN_EMAILS: process.env.ADMIN_EMAILS ?? "",
  SITE_URL: process.env.SITE_URL ?? "http://localhost:3000",
  // optional (μπαίνουν μόνο αν υπάρχουν)
  INTEREST_THRESHOLD: process.env.INTEREST_THRESHOLD,
  INTEREST_WINDOW_DAYS: process.env.INTEREST_WINDOW_DAYS,
  MAP_TOKEN: process.env.MAP_TOKEN,
} as const;

export const adminEmails = (env.ADMIN_EMAILS || "")
  .split(",")
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_MAPTILER_KEY: env.NEXT_PUBLIC_MAPTILER_KEY,
} as const;
