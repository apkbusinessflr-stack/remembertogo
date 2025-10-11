import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL ?? "https://remembertogo.com";
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/map`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/admin`, changeFrequency: 'monthly', priority: 0.4 }
  ];
}
