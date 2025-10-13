import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "RememberToGo",
  description: "Production starter with Next.js, Tailwind, MapLibre, Supabase and Neon."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-4xl p-6">{children}</div>
      </body>
    </html>
  );
}
