import { countries, categories } from "@/lib/catalog";
export default function CountryPage({ params }:{ params:{ code:string }}) {
  const code = params.code.toUpperCase();
  const c = countries.find(x => x.code === code);
  if (!c) return <main className="space-y-4"><h1>Unknown country</h1></main>;
  return (
    <main className="space-y-6">
      <h1>{c.name}</h1>
      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map(cat => (
          <a key={cat.slug} className="card no-underline" href={`/categories/${cat.slug}?country=${code}`}>
            <div className="text-lg font-semibold">{cat.name}</div>
            <div className="opacity-70 text-sm">{code}</div>
          </a>
        ))}
      </section>
    </main>
  );
}
