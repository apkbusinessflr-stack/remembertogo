// components/ShareCardButton.tsx
"use client";
import { useState } from "react";

type Props = {
  listName: string;
  visited: number;
  total: number;
};

export default function ShareCardButton({ listName, visited, total }: Props) {
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (loading) return;
    setLoading(true);

    try {
      // Ask API to build a clean OG URL (centralizes logic)
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "list", name: listName, v: visited, t: total }),
      });

      let urlPath = `/og/list?name=${encodeURIComponent(listName)}&v=${visited}&t=${total}`;
      if (res.ok) {
        const j = (await res.json()) as { url?: string };
        if (j?.url) urlPath = j.url;
      }

      const absUrl = new URL(urlPath, location.origin).toString();

      // Try modern clipboard API
      let copied = false;
      try {
        await navigator.clipboard.writeText(absUrl);
        copied = true;
      } catch {
        // Fallback 1: execCommand('copy') via temp input
        try {
          const input = document.createElement("input");
          input.value = absUrl;
          input.setAttribute("readonly", "");
          input.style.position = "absolute";
          input.style.opacity = "0";
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
          copied = true;
        } catch {
          // Fallback 2: prompt
          window.prompt("Copy the share image URL:", absUrl);
        }
      }

      if (copied) {
        alert("Share image URL copied to clipboard!");
      } else {
        alert("URL shown. Copy it and share!");
      }

      // Optional: open a preview tab so user sees the image immediately
      window.open(absUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      alert("Failed to generate share image URL. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="btn" onClick={generate} disabled={loading}>
      {loading ? "Generating…" : "Generate Share Card"}
    </button>
  );
}
