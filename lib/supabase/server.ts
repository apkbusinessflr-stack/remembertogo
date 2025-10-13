// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Δημιουργεί Supabase client στη server με cookie-based συνεδρίες.
 * Συμβατό με Next.js App Router (route handlers / server components).
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  const client = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Σε route handlers επιτρέπεται set/remove.
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        }
      },
      headers: { "X-Client-Info": "remembertogo/3" }
    }
  );

  return client;
}

/** Backwards-compatible alias (αν κάπου γίνεται import ως supabaseServer) */
export const supabaseServer = createSupabaseServerClient;
