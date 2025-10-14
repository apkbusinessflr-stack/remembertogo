"use client";
import { useEffect, useState } from "react";

const KEY = "consent_status"; // "accepted" | "npa"

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // εμφάνισε banner μόνο αν δεν έχει δοθεί επιλογή
    const v = localStorage.getItem(KEY);
    if (!v) setShow(true);
  }, []);

  if (!show) return null;

  function acceptPersonalized() {
    localStorage.setItem(KEY, "accepted");
    location.reload();
  }

  function acceptNPA() {
    localStorage.setItem(KEY, "npa");
    location.reload();
  }

  return (
    <div className="fixed bottom-4 inset-x-0 px-4 z-50">
      <div className="container">
        <div className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm">
            We use cookies for analytics and ads. Choose personalized ads or continue with
            non-personalized ads (NPA).
          </div>
          <div className="flex gap-2">
            <button className="btn" onClick={acceptPersonalized}>
              Accept (Personalized)
            </button>
            <button className="btn" onClick={acceptNPA}>
              Continue (NPA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
