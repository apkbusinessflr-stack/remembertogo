import { createClient } from "@supabase/supabase-js";

// Χρησιμοποιούμε μόνο PUBLIC envs στον client.
// Αυτά ξεκινάνε με NEXT_PUBLIC_ και είναι διαθέσιμα στο browser build.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon);
