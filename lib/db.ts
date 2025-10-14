// lib/db.ts
export type Place = {
  id: number;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  country: string;        // ISO-3166-1 alpha-2 (e.g., "PT")
  tags?: string[];
};

export type List = {
  slug: string;
  title: string;
  country?: string;       // optional ISO code
  category: string;       // e.g., "beaches"
  places: number[];       // place ids
};

// --- Seed data (replace later with real DB) ---
export const places: Place[] = [
  {
    id: 1,
    slug: "praia-da-urca",                   // keep as-is to match existing routes
    name: "Praia da Ursa",
    lat: 38.7925,
    lng: -9.4851,
    country: "PT",
    tags: ["beach", "cliffs", "scenic"],
  },
  {
    id: 2,
    slug: "praia-da-marinha",
    name: "Praia da Marinha",
    lat: 37.0909,
    lng: -8.4129,
    country: "PT",
    tags: ["beach", "algarve"],
  },
  {
    id: 3,
    slug: "cabo-da-roca-viewpoint",
    name: "Cabo da Roca Viewpoint",
    lat: 38.7804,
    lng: -9.4989,
    country: "PT",
    tags: ["viewpoint", "atlantic"],
  },
];

export const lists: List[] = [
  {
    slug: "portugal-beaches",
    title: "Portugal • Beaches",
    country: "PT",
    category: "beaches",
    places: [1, 2],
  },
];

// --- Query helpers (pure, synchronous) ---
export function getPlace(slug: string): Place | undefined {
  return places.find((p) => p.slug === slug);
}

export function getPlacesByIds(ids: number[]): Place[] {
  const set = new Set(ids);
  return places.filter((p) => set.has(p.id));
}

export function getList(slug: string): List | undefined {
  return lists.find((l) => l.slug === slug);
}
