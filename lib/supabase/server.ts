// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { env } from "@/lib/env";

// Δημιουργεί Supabase client για server components/route handlers
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon",
    {
      // ΝΕΟ: explicit cookie methods (όχι απλά passing το cookies())
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // σε RSC μπορεί να ρίξει αν τα headers έχουν σταλεί ήδη — αγνόησέ το
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch {
            // same as above
          }
        },
      },
      // αν χρειαστεί headers, πρόσθεσέ τα σε calls όπου τα θες, όχι εδώ
    }
  );
}

export type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;
