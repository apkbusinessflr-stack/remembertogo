// app/sitemap.ts
import { env } from "@/lib/env";

export default async function sitemap() {
  const base = new URL(env.SITE_URL);
  return [
    { url: new URL("/", base).toString(), lastModified: new Date() },
    // add sections…
  ];
}

// app/robots.ts
import { env } from "@/lib/env";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${env.SITE_URL}/sitemap.xml`,
    host: env.SITE_URL,
  };
}
