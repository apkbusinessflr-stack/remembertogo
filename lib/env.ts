// lib/env.ts
import { z } from "zod";

/**
 * Centralized, typed env access for remembertogo.
 * - Validates at import time (fail-fast in CI/production).
 * - Only NEXT_PUBLIC_* are exposed for client use.
 * - Provides small helpers for common needs.
 */

const ServerSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const ClientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .optional(), // e.g. https://remembertogo.com (no trailing slash preferred)
  NEXT_PUBLIC_ADSENSE_CLIENT: z
    .string()
    .regex(/^ca-pub-\d+$/)
    .optional(), // e.g. ca-pub-5077568341465757
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(), // e.g. remembertogo.com
});

const _server = ServerSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
});

const _client = ClientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ADSENSE_CLIENT: process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
});

if (!_client.success) {
  // In production we fail hard; in dev we log a warning and continue.
  const msg = `Invalid public env: ${_client.error.issues
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join(", ")}`;

  if (_server.NODE_ENV === "production") {
    throw new Error(msg);
  } else {
    // eslint-disable-next-line no-console
    console.warn("[env] " + msg);
  }
}

export const SERVER = {
  nodeEnv: _server.NODE_ENV,
  isProd: _server.NODE_ENV === "production",
  isDev: _server.NODE_ENV === "development",
  isTest: _server.NODE_ENV === "test",
};

export const PUBLIC = {
  siteUrl: _client.success ? _client.data.NEXT_PUBLIC_SITE_URL : undefined,
  adsenseClient: _client.success ? _client.data.NEXT_PUBLIC_ADSENSE_CLIENT : undefined,
  plausibleDomain: _client.success ? _client.data.NEXT_PUBLIC_PLAUSIBLE_DOMAIN : undefined,
};

/** Return canonical absolute base URL (no trailing slash). */
export function baseUrl(): string {
  const raw = PUBLIC.siteUrl || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

/** Build absolute URL from a pathname or relative URL. */
export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl()}${p}`;
}
