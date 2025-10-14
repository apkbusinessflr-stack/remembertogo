// app/u/[username]/page.tsx
import type { Metadata } from "next";

type Props = { params: { username: string } };

export function generateMetadata({ params }: Props): Metadata {
  const u = params.username || "user";
  return {
    title: `@${u} • remembertogo`,
    description: `Profile of @${u} on remembertogo.`,
    openGraph: {
      title: `@${u} • remembertogo`,
      description: `Profile of @${u} on remembertogo.`,
      url: `/u/${u}`,
    },
  };
}

export default function Profile({ params }: Props) {
  const username = params.username;

  return (
    <main className="space-y-6">
      <h1>@{username}</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">Visited: 23</div>
        <div className="card">Tips: 4</div>
        <div className="card">Followers: 12</div>
      </div>
    </main>
  );
}
