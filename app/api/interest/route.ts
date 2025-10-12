// app/api/interest/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase/server";
import { sql } from "../../../lib/db";

export async function POST(req: NextRequest) {
  const supabase = supabaseServer(); // 👈 ΠΡΕΠΕΙ να καλεστεί

  // ... ο υπόλοιπος κώδικάς σου (χρησιμοποίησε supabase εδώ)
  return NextResponse.json({ ok: true });
}
