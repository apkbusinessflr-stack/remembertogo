'use client';
import Link from 'next/link';

export default function Nav({ email }: { email?: string | null }) {
  return (
    <header className="flex items-center justify-between py-4">
      <Link href="/" className="text-lg font-semibold">remembertogo</Link>
      <nav className="flex items-center gap-3 text-sm">
        <Link href="/map">Map</Link>
        <Link href="/admin">Admin</Link>
        {email ? <Link href="/account">{email}</Link> : <Link href="/login">Login</Link>}
      </nav>
    </header>
  );
}
