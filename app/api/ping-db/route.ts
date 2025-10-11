// app/api/ping-db/route.ts
import { NextResponse } from 'next/server';
import pg from 'pg';

const { Pool } = pg;

// Pool εκτός handler για να γίνει reuse στα serverless invocations
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Neon
});

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, error: 'Missing DATABASE_URL' },
      { status: 500 }
    );
  }

  try {
    const { rows } = await pool.query('select now() as now');
    return NextResponse.json({ ok: true, now: rows[0]?.now });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'db error' },
      { status: 500 }
    );
  }
}
