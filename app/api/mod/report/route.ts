// app/api/mod/report/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const schema = z.object({
  target_type: z.enum(["place", "tip", "photo", "list"]),
  target_id: z.coerce.number().int().positive(),
  reason: z.string().min(3, "reason must be at least 3 characters")
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
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // TODO: enqueue moderation job (e.g., write to DB/queue)
  return NextResponse.json(
    { queued: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
