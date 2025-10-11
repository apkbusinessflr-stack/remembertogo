'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function Nav() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);
  return (
    <header className="flex items-center justify-between mb-6">
      <Link className="text-xl font-bold" href="/">MapQuest</Link>
      <nav className="flex items-center gap-3 text-sm">
        <Link href="/map">Map</Link>
        <Link href="/lists/demo">Lists</Link>
        <Link href="/admin">Admin</Link>
        {email ? <Link href="/account">{email}</Link> : <Link href="/login">Login</Link>}
      </nav>
    </header>
  );
}
