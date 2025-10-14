// app/countries/[code]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { countries, categories } from "@/lib/catalog";

type Props = { params: { code: string } };

export function generateMetadata({ params }: Props): Metadata {
  const code = (params.code || "").toUpperCase();
  const c = countries.find((x) => x.code === code);
  if (!c) return { title: "Country not found • remembertogo" };
  return { title: `${c.name} • remembertogo` };
}

export default function CountryPage({ params }: Props) {
  const code = (params.code || "").toUpperCase();
  const c = countries.find((x) => x.code === code);
  if (!c) return notFound();

  return (
    <main className="space-y-6">
      <h1>{c.name}</h1>
      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            className="card no-underline"
            href={`/categories/${cat.slug}?country=${code}`}
          >
            <div className="text-lg font-semibold">{cat.name}</div>
            <div className="opacity-70 text-sm">{code}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
