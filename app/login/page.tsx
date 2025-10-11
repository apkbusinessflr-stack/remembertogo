'use client';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/account` } });
  }
  async function signOut() {
    await supabase.auth.signOut();
    location.href = '/';
  }
  return (
    <main className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Login</h2>
        <div className="flex gap-3">
          <button className="btn" onClick={signInWithGoogle}>Continue with Google</button>
          <button className="btn" onClick={signOut}>Sign out</button>
        </div>
      </div>
    </main>
  );
}
