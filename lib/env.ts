// lib/env.ts
const defaults = {
  // Public (client)
  NEXT_PUBLIC_SUPABASE_URL: "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
  NEXT_PUBLIC_MAPTILER_KEY: "",
  // Server
  DATABASE_URL: "",
  CRON_SECRET: "",
  ADMIN_EMAILS: "",
  INTEREST_THRESHOLD: "25",
  INTEREST_WINDOW_DAYS: "30",
  SITE_URL: ""
} as const;

type Key = keyof typeof defaults;

function readEnv(): Record<Key, string> {
  const out: Record<string, string> = {};
  for (const k of Object.keys(defaults) as Key[]) {
    const v = process.env[k] ?? defaults[k] ?? "";
    if (!v) {
      // Σε prod ρίχνουμε error, σε dev/preview απλά προειδοποίηση
      const isProd = (process.env.VERCEL_ENV ?? process.env.NODE_ENV) === "production";
      const msg = `[env] Missing ${k}`;
      if (isProd) throw new Error(msg);
      else console.warn(msg);
    }
    out[k] = String(v ?? "");
  }
  return out as Record<Key, string>;
}

export const env = readEnv();

// Helpers/derivatives
export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_MAPTILER_KEY: env.NEXT_PUBLIC_MAPTILER_KEY
};

// Admin emails parsed
export const adminEmails = (env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
