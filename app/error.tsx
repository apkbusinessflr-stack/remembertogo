// app/error.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log client-side for debugging (Sentry/console etc.)
  useEffect(() => {
    // Replace with your logger (e.g., Sentry.captureException(error))
    // eslint-disable-next-line no-console
    console.error("App Error:", { message: error.message, digest: (error as any).digest });
  }, [error]);

  const isDev = process.env.NODE_ENV !== "production";
  const message = isDev
    ? (error.message || "Please try again.")
    : "An unexpected error occurred. Please try again.";

  return (
    <main className="container py-16 text-center">
      <h1 className="text-3xl font-semibold mb-2">Something went wrong</h1>
      <p className="opacity-70 mb-6">{message}</p>

      <div className="flex items-center justify-center gap-3">
        <button className="btn" onClick={() => reset()}>
          Try again
        </button>
        <Link className="btn" href="/">
          Back to home
        </Link>
      </div>

      {!isDev && (error as any).digest ? (
        <p className="opacity-50 text-xs mt-4">
          Error ID: {(error as any).digest}
        </p>
      ) : null}
    </main>
  );
}
