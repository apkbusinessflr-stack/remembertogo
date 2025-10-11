import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/login');

  return (
    <main className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">My Account</h2>
        <pre className="text-xs opacity-80">{JSON.stringify({ id: data.user.id, email: data.user.email }, null, 2)}</pre>
      </div>
    </main>
  );
}
