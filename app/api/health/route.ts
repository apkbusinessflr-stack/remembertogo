// app/api/health/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // γρήγορο & φθηνό

export async function GET() {
  return NextResponse.json({
    ok: true,
    env: process.env.VERCEL_ENV ?? 'unknown',
    ts: new Date().toISOString(),
  });
}
