// lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Minimal Supabase client singleton for remembertogo.
 * - Uses public anon key (RLS must protect data).
 * - Safe for browser and server/edge (reuses global fetch).
 * - No auth-helpers dependency; session persists in browser via localStorage.
 *
 * Set in Vercel env:
 *   NEXT_PUBLIC_SUPABASE_URL = https://<project>.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY = <anon key>
 */

let _client: SupabaseClient | null = null;

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
      // In the browser we persist the session; on server there's no storage.
      persistSession: typeof window !== "undefined",
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: (...args) => fetch(...(args as Parameters<typeof fetch>)),
    },
  });

  return _client;
}
