const isProd = process.env.NODE_ENV === "production";

type RequiredEnv = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_MAPTILER_KEY: string;
  DATABASE_URL: string;
  CRON_SECRET: string;
  ADMIN_EMAILS: string;
  SITE_URL: string;
};
type OptionalEnv = {
  INTEREST_THRESHOLD?: string | undefined;
  INTEREST_WINDOW_DAYS?: string | undefined;
  MAP_TOKEN?: string | undefined;
};
function requireEnv(name: keyof RequiredEnv): string {
  const v = process.env[name as string];
  if (!v || v.trim() === "") throw new Error(`Missing required env: ${name}`);
  return v;
}
const required: RequiredEnv = {
  NEXT_PUBLIC_SUPABASE_URL: isProd ? requireEnv("NEXT_PUBLIC_SUPABASE_URL") : (process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: isProd ? requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""),
  NEXT_PUBLIC_MAPTILER_KEY: isProd ? requireEnv("NEXT_PUBLIC_MAPTILER_KEY") : (process.env.NEXT_PUBLIC_MAPTILER_KEY ?? ""),
  DATABASE_URL: isProd ? requireEnv("DATABASE_URL") : (process.env.DATABASE_URL ?? ""),
  CRON_SECRET: isProd ? requireEnv("CRON_SECRET") : (process.env.CRON_SECRET ?? "dev-cron"),
  ADMIN_EMAILS: process.env.ADMIN_EMAILS ?? "",
  SITE_URL: process.env.SITE_URL ?? "http://localhost:3000"
};
const optional: OptionalEnv = {
  INTEREST_THRESHOLD: process.env.INTEREST_THRESHOLD,
  INTEREST_WINDOW_DAYS: process.env.INTEREST_WINDOW_DAYS,
  MAP_TOKEN: process.env.MAP_TOKEN
};
export type Env = RequiredEnv & OptionalEnv;
export const env: Env = { ...required, ...optional };
export const adminEmails: string[] = (env.ADMIN_EMAILS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_MAPTILER_KEY: env.NEXT_PUBLIC_MAPTILER_KEY
} as const;
