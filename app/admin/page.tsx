import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export default async function AdminHome() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/login');

  const admins = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (admins.length && !admins.includes(data.user.email ?? '')) redirect('/');

  const rows = await db`SELECT code, name, approved FROM countries ORDER BY approved DESC, name ASC LIMIT 20` as any;

  return (
    <main className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Admin Dashboard</h2>
        <p className="opacity-80 text-sm mb-3">First 20 countries (demo)</p>
        <table className="w-full text-sm">
          <thead><tr><th className="text-left py-2">Code</th><th className="text-left">Name</th><th className="text-left">Approved</th></tr></thead>
          <tbody>
            {rows.map((r:any) => (
              <tr key={r.code} className="border-t border-white/10">
                <td className="py-2">{r.code}</td>
                <td>{r.name}</td>
                <td>{String(r.approved)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
