import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { supabaseServer } from "@/lib/supabase/server";

function parseBbox(str: string) {
  const p = str.split(",").map(Number);
  if (p.length !== 4 || p.some((x) => Number.isNaN(x))) return null;
  const [w, s, e, n] = p;
  if (!(w < e && s < n)) return null;
  return [w, s, e, n] as const;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("bbox");
  if (!q) return NextResponse.json({ error: "bbox required" }, { status: 400 });
  const bbox = parseBbox(q);
  if (!bbox) return NextResponse.json({ error: "invalid bbox" }, { status: 400 });

  const [w, s, e, n] = bbox;
  const rows = await sql`
    select id, kind, title, country_code, lat, lng, created_at
    from places
    where lng between ${w} and ${e} and lat between ${s} and ${n}
      and is_public = true
    order by created_at desc
    limit 500
  `;
  return NextResponse.json({ items: rows });
}

export async function POST(req: NextRequest) {
  const s = supabaseServer();
  const { data } = await s.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const required = ["kind","title","country_code","lat","lng"];
  for (const k of required) if (!(k in body)) return NextResponse.json({ error: `missing ${k}` }, { status: 400 });

  const rows = await sql`
    insert into places (owner, kind, title, description, country_code, lat, lng, is_public)
    values (${data.user.id}::uuid, ${body.kind}, ${body.title}, ${body.desc ?? ""}, ${body.country_code}, ${body.lat}, ${body.lng}, ${body.is_public ?? true})
    returning id
  `;
  return NextResponse.json({ ok: true, id: rows[0].id });
}
