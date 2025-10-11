// lib/env.ts
const defaults = {
  NODE_ENV: "development",
  SITE_URL: "",
  NEXT_PUBLIC_SUPABASE_URL: "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
  NEXT_PUBLIC_MAPTILER_KEY: "", // <-- public key (client)
  MAP_TOKEN: "",                // legacy fallback
  DATABASE_URL: "",
  CRON_SECRET: "",
  ADMIN_EMAILS: ""              // comma/space/semicolon separated
} as const;

type Key = keyof typeof defaults;

function readEnv(): Record<Key, string> {
  const out: Record<string, string> = {} as any;
  for (const k of Object.keys(defaults)) {
    const v = (process.env as Record<string, string | undefined>)[k] ?? (defaults as any)[k] ?? "";
    if (!v) console.warn(`[env] Missing ${k}. Using empty string (build proceeds).`);
    out[k as Key] = String(v);
  }
  return out as Record<Key, string>;
}

export const env = readEnv();

// Safe για client
export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_MAPTILER_KEY: env.NEXT_PUBLIC_MAPTILER_KEY || env.MAP_TOKEN, // υποστήριξη και για legacy όνομα
};

// Admin emails ως array
export const adminEmails: string[] =
  (env.ADMIN_EMAILS || "")
    .split(/[,\s;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
