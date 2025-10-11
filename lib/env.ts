const defaults = {
  NODE_ENV: "development",
  SITE_URL: "",
  NEXT_PUBLIC_SUPABASE_URL: "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
  DATABASE_URL: "",
  MAP_TOKEN: "",
  CRON_SECRET: ""
} as const;

type Key = keyof typeof defaults;

function readEnv(): Record<Key, string> {
  const out: Record<string, string> = {};
  for (const k of Object.keys(defaults)) {
    const v = (process.env as Record<string, string | undefined>)[k] ?? (defaults as any)[k] ?? "";
    if (!v) {
      console.warn(`[env] Missing ${k}. Using empty string (build proceeds).`);
    }
    out[k] = String(v);
  }
  return out as Record<Key, string>;
}

export const env = readEnv();

export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY
};
