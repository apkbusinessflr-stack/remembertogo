// components/ConsentBanner.tsx
"use client";

import { useEffect, useState } from "react";

/**
 * Απλό, ασφαλές consent banner:
 * - Δουλεύει μόνο client (use client)
 * - Guard για localStorage διαθεσιμότητα
 * - Κλείνει χωρίς reload (setV(false))
 * - Tailwind classes (όχι custom 'card'|'btn')
 */
export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  // localStorage guard
  const hasStorage = (): boolean => {
    try {
      if (typeof window === "undefined") return false;
      const k = "__consent_test__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!hasStorage()) {
      // αν δεν υπάρχει storage, μην δείχνεις banner (ή δείξε άλλο flow)
      setShow(false);
      return;
    }
    const accepted = window.localStorage.getItem("consent_accepted") === "1";
    setShow(!accepted);
  }, []);

  const accept = () => {
    if (hasStorage()) window.localStorage.setItem("consent_accepted", "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-4 z-50 px-4"
      role="region"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-3xl rounded-xl border bg-white p-4 shadow-lg">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-700">
            We use cookies for analytics and ads. You can continue with non-personalized ads.
          </p>
          <div className="flex gap-2">
            <button
              onClick={accept}
              className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-800"
            >
              Accept
            </button>
            <button
              onClick={accept}
              className="rounded-md border px-3 py-1.5 text-sm text-neutral-900 hover:bg-neutral-50"
              aria-label="Continue with non-personalized ads"
              title="Continue with non-personalized ads"
            >
              Continue (NPA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
