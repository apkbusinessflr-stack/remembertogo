// app/api/cron/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // no cache

export async function GET(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  if (!process.env.CRON_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'Missing CRON_SECRET' },
      { status: 500 }
    );
  }
  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: βάλε εδώ τη δουλειά σου (sync, emails, κλπ)
  return NextResponse.json({ ok: true, ranAt: new Date().toISOString() });
}
