// lib/catalog.ts
export type Category = { slug: string; name: string };
export type Country = { code: string; name: string };

export const categories: Category[] = [
  { slug: "beaches", name: "Beaches" },
  { slug: "hikes", name: "Hikes" },
  { slug: "waterfalls", name: "Waterfalls" },
  { slug: "viewpoints", name: "Viewpoints" },
];

export const countries: Country[] = [
  { code: "PT", name: "Portugal" },
  { code: "GR", name: "Greece" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "FR", name: "France" },
];

export function getCountryName(code: string): string | undefined {
  const c = countries.find((x) => x.code.toUpperCase() === code.toUpperCase());
  return c?.name;
}
