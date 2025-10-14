// lib/seo.ts
import { absoluteUrl, baseUrl } from "@/lib/env";

/** Minimal shape used by SEO helpers (matches lib/db Place fields). */
export type SeoPlace = {
  id: number;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  country: string;   // ISO-3166-1 alpha-2
  tags?: string[];
};

/** Build canonical absolute URLs. */
export function placeUrl(slug: string): string {
  return absoluteUrl(`/place/${slug}`);
}
export function listUrl(slug: string): string {
  return absoluteUrl(`/lists/${slug}`);
}
export function profileUrl(username: string): string {
  return absoluteUrl(`/u/${username}`);
}

/** Page <title> helpers */
export function titleForPlace(p: SeoPlace): string {
  return `${p.name} • remembertogo`;
}
export function titleForList(listTitle: string): string {
  return `${listTitle} • remembertogo`;
}

/** OpenGraph image helpers (absolute) */
export function ogListImage(name: string, v?: number, t?: number): string {
  const params = new URLSearchParams({ name });
  if (typeof v === "number") params.set("v", String(v));
  if (typeof t === "number") params.set("t", String(t));
  return `${baseUrl()}/og/list?${params.toString()}`;
}
export function ogProfileImage(username: string, v?: number): string {
  const params = new URLSearchParams({ u: username });
  if (typeof v === "number") params.set("v", String(v));
  return `${baseUrl()}/og/profile?${params.toString()}`;
}

/**
 * JSON-LD schema for a Place (https://schema.org/Place)
 * Use in a <script type="application/ld+json"> tag.
 */
export function placeSchema(place: SeoPlace) {
  const url = placeUrl(place.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": ["Place", "TouristAttraction"],
    name: place.name,
    url,
    mainEntityOfPage: url,
    geo: {
      "@type": "GeoCoordinates",
      latitude: place.lat,
      longitude: place.lng,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: place.country,
    },
    // Optional hints
    keywords: Array.isArray(place.tags) && place.tags.length ? place.tags.join(", ") : undefined,
    // A generic image placeholder; replace with first approved photo when available
    image: undefined as unknown as string | undefined,
  };

  // Strip undefined to keep output clean
  return withoutUndefined(schema);
}

/**
 * JSON-LD schema for a curated list page.
 * Emits an ItemList with ListItem entries for each place (first N to avoid huge payloads).
 */
export function listSchema(opts: {
  title: string;
  slug: string;
  places: SeoPlace[];
  maxItems?: number; // default 25
}) {
  const { title, slug, places, maxItems = 25 } = opts;
  const url = listUrl(slug);
  const trimmed = places.slice(0, maxItems);

  const schema = {
    "@context": "https://schema.org",
    "@type": ["CollectionPage", "ItemList"],
    name: title,
    url,
    mainEntityOfPage: url,
    numberOfItems: trimmed.length,
    itemListElement: trimmed.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: placeUrl(p.slug),
      item: {
        "@type": ["Place", "TouristAttraction"],
        name: p.name,
        url: placeUrl(p.slug),
        geo: {
          "@type": "GeoCoordinates",
          latitude: p.lat,
          longitude: p.lng,
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: p.country,
        },
      },
    })),
  };

  return withoutUndefined(schema);
}

/** Breadcrumbs JSON-LD (optional enhancement for deep pages). */
export function breadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/* ------------ utils ------------ */
function withoutUndefined<T extends Record<string, any>>(obj: T): T {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = withoutUndefined(v as any);
    } else if (Array.isArray(v)) {
      out[k] = v.map((x) => (x && typeof x === "object" ? withoutUndefined(x) : x));
    } else {
      out[k] = v;
    }
  }
  return out as T;
}
