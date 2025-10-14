// app/api/share/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const schema = z.object({
  type: z.enum(["list", "profile"]).default("list"),
  // optional payload to customize the OG URL
  name: z.string().max(120).optional(),         // for list share-card title
  v: z.coerce.number().int().positive().optional(), // version/hash param
  t: z.coerce.number().int().optional(),            // total/seed param
  username: z.string().max(40).optional(),     // for profile card
});

export async function POST(req: Request) {
  // Content-Type guard
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  // Parse JSON body
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { type, name, v, t, username } = parsed.data;

  // Build OG URL
  let url: string;
  if (type === "profile") {
    const u = encodeURIComponent(username || "guest");
    url = `/og/profile?u=${u}${v ? `&v=${v}` : ""}`;
  } else {
    const n = encodeURIComponent(name || "Portugal • Beaches");
    url = `/og/list?name=${n}${v ? `&v=${v}` : ""}${t ? `&t=${t}` : ""}`;
  }

  return NextResponse.json(
    { url },
    { headers: { "Cache-Control": "no-store" } }
  );
}
