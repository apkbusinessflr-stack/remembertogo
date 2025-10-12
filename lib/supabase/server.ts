// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { env } from "@/lib/env";

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            /* noop for RSC after headers sent */
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch {
            /* noop */
          }
        },
      },
    }
  );
}

// ⬇️ Alias για συμβατότητα με υπάρχοντα imports
export const supabaseServer = createSupabaseServerClient;
export type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;
