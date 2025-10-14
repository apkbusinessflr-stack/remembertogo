// components/ConsentBanner.tsx
"use client";
import { useEffect, useState } from "react";

type ConsentMode = "accepted" | "npa";
type ConsentValue = { mode: ConsentMode; t: number };

const KEY = "consent_status"; // stores JSON: { mode: "accepted" | "npa", t: epoch_ms }

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) setShow(true);
    } catch {
      // if storage blocked, still show banner
      setShow(true);
    }
  }, []);

  if (!show) return null;

  function save(mode: ConsentMode) {
    try {
      const v: ConsentValue = { mode, t: Date.now() };
      localStorage.setItem(KEY, JSON.stringify(v));
    } catch {
      // ignore storage errors
    }
    // Reload so NPA flag is applied before AdSense loads
    location.reload();
  }

  return (
    <div className="fixed bottom-4 inset-x-0 px-4 z-50" role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <div className="container">
        <div className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm">
            <strong id="consent-title">Cookies & Ads</strong> — We use cookies for analytics and Google AdSense. Choose personalized ads or continue with non-personalized ads (NPA). See our{" "}
            <a className="underline" href="/cookies">Cookie & Ads Policy</a>.
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn" onClick={() => save("accepted")}>
              Accept (Personalized)
            </button>
            <button className="btn btn-secondary" onClick={() => save("npa")}>
              Continue (NPA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
