// app/api/tip/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const schema = z.object({
  place_id: z.coerce.number().int().positive(),
  body: z.string().min(3).max(240),
  lang: z.string().min(2).max(5).default("en")
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

  // Parse JSON
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

  // TODO: persist tip (auth, rate-limit, moderation queue)
  return NextResponse.json(
    { status: "pending" },
    { headers: { "Cache-Control": "no-store" } }
  );
}
