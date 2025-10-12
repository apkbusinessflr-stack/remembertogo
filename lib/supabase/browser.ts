// lib/supabase/browser.ts
import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon"
  );
}

// ⬇️ Alias για συμβατότητα με υπάρχοντα imports
export const supabaseBrowser = createSupabaseBrowserClient;
export type SupabaseBrowserClient = ReturnType<typeof createSupabaseBrowserClient>;
