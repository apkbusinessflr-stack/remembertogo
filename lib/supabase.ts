// lib/supabase.ts
// Helpers για χρήση Supabase σε Next.js (App Router).
// - Server: SSR-aware, μεταφέρει cookies/headers για ασφαλές auth.
// - Client: singleton για browser.
// Προϋποθέτει env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.

import { cookies, headers } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createBrowserClient, type SupabaseClient } from "@supabase/ssr";

let browserClient: SupabaseClient | null = null;

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Κάνε fail νωρίς σε dev/preview για να μη debug-άρεις στο dark.
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return { url, key };
}

/**
 * Server-side Supabase (Route Handlers, Server Actions, Server Components)
 * - Χρησιμοποιεί το cookie store του Next για να μείνει σε sync με την auth session.
 * - ΠΡΟΣΟΧΗ: Κάλεσέ το μέσα σε request scope (όχι top-level).
 */
export function getSupabaseServer() {
  const { url, key } = getEnv();
  const cookieStore = cookies();
  const hdrs = headers();

  // Χρησιμοποιούμε custom cookie adapter για να μην πετάμε σε Edge.
  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Σε Edge runtime, το set μπορεί να μην είναι διαθέσιμο.
          // Δεν κάνουμε throw για να μη σπάσει το request· απλώς αγνοούμε.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // βλ. παραπάνω σχόλιο
        }
      },
    },
    // Περνάμε headers ώστε να υποβοηθήσουμε SSR αν χρειαστεί.
    global: {
      headers: Object.fromEntries(hdrs),
    },
  });
}

/**
 * Browser-side Supabase (Client Components)
 * - Singleton για να μη δημιουργούμε νέο client σε κάθε render.
 */
export function getSupabaseBrowser() {
  if (browserClient) return browserClient;
  const { url, key } = getEnv();
  browserClient = createBrowserClient(url, key, {
    // Βάλε μικρότερο retry αν θες πιο "snappy" σφάλματα σε αστάθεια δικτύου.
    global: { fetch, headers: {} },
  });
  return browserClient;
}
