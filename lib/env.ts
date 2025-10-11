import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
  DATABASE_URL: z.string().url(),
  SITE_URL: z.string().url().default("https://remembertogo.com"),
  ADMIN_KEY: z.string().min(16, "ADMIN_KEY too short"),
  INTEREST_THRESHOLD: z.coerce.number().default(5),
  INTEREST_WINDOW_DAYS: z.coerce.number().default(7)
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  SITE_URL: process.env.SITE_URL ?? "https://remembertogo.com",
  ADMIN_KEY: process.env.ADMIN_KEY,
  INTEREST_THRESHOLD: process.env.INTEREST_THRESHOLD,
  INTEREST_WINDOW_DAYS: process.env.INTEREST_WINDOW_DAYS
});
