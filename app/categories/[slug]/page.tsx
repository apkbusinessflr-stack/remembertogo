// app/categories/[slug]/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/catalog";

type Props = {
  params: { slug: string };
  searchParams?: { country?: string };
};

export function generateMetadata({ params, searchParams }: Props): Metadata {
  const cat = categories.find((x) => x.slug === params.slug);
  if (!cat) return { title: "Category not found • remembertogo" };

  const cc = (searchParams?.country || "").toUpperCase();
  const title = cc ? `${cat.name} in ${cc}` : cat.name;

  return {
    title: `${title} • remembertogo`,
    description: `Explore ${cat.name}${cc ? ` in ${cc}` : ""} on remembertogo.`,
  };
}

export default function CategoryPage({ params, searchParams }: Props) {
  const cat = categories.find((x) => x.slug === params.slug);
  if (!cat) return notFound();

  const country = (searchParams?.country || "").toUpperCase();

  return (
    <main className="space-y-4">
      <h1>{country ? `${cat.name} in ${country}` : cat.name}</h1>
      <p className="opacity-80 text-sm">
        This is a category landing. In production, show featured lists/places for SEO.
      </p>
      <ul className="list-disc list-inside opacity-80 text-sm">
        <li>
          <Link href="/lists/portugal-beaches">Featured lists (editorial)</Link>
        </li>
        <li>
          <Link href="/place/praia-da-urca">Top places (by popularity)</Link>
        </li>
        <li>Internal links to /lists/... and /place/...</li>
      </ul>
    </main>
  );
}
