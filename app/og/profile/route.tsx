// app/og/profile/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const u = sp.get("u") ?? "guest";
  const v = Number(sp.get("v") ?? "42");
  const brand = "remembertogo";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg,#201744,#351a68)",
          color: "#e6f0ff",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800 }}>@{u}</div>
        <div style={{ fontSize: 40, marginTop: 12 }}>Visited {v} places</div>
        <div style={{ fontSize: 22, marginTop: 24, opacity: 0.7 }}>
          {brand}
        </div>
      </div>
    ),
    { ...size }
  );
}
