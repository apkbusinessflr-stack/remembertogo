// app/api/visit/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const schema = z.object({
  place_id: z.coerce.number().int().positive(),
  visited: z.boolean().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  visited_at: z
    .string()
    .datetime()
    .optional(), // ISO 8601 e.g. "2025-10-14T20:15:00Z"
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

  // TODO: upsert visit (auth, idempotency per user+place)
  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
