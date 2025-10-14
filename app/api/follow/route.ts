// app/api/follow/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const schema = z.object({
  user_id: z.string().min(1, "user_id is required")
});

export async function POST(req: Request) {
  // Ensure JSON content
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  // Parse body
  let json: unknown = null;
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

  // TODO: implement follow logic (auth, DB write, idempotency)
  return NextResponse.json({ ok: true }, {
    headers: { "Cache-Control": "no-store" }
  });
}
