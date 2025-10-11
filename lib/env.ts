// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  SITE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
  DATABASE_URL: z.string().url(), // Neon postgres (serverless connection string)
  ADMIN_EMAILS: z.string().optional(), // comma-separated
  CRON_SECRET: z.string().min(16),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}
export const env = parsed.data;
// helper
export const adminEmails = new Set(
  (env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
);
