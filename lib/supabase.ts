// lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Unified (SSR/Edge/Browser) lazy singleton
let _client: SupabaseClient | null = null;

/**
 * Server/Edge safe client (also works in the browser).
 * Reads NEXT_PUBLIC_ envs directly; make sure they are set in Vercel.
 */
export function supabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    const msg =
      "Missing Supabase env. Define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";
    if (process.env.NODE_ENV === "production") {
      throw new Error(msg);
    } else {
      // eslint-disable-next-line no-console
      console.warn("[supabase] " + msg);
    }
  }

  _client = createClient(url!, anon!, {
    auth: {
      persistSession: typeof window !== "undefined",
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: { fetch: (...args) => fetch(...(args as Parameters<typeof fetch>)) },
  });

  return _client;
}

/**
 * Browser-only helper (returns null if envs are missing).
 * Keep if you prefer an explicit browser import pattern.
 */
export function supabaseBrowser(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: true, storage: window.localStorage, autoRefreshToken: true, detectSessionInUrl: true },
  });
}
