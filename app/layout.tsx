// app/layout.tsx
import type { Metadata } from "next";

// Αν έχεις το αρχείο μέσα στο app/, άφησε έτσι:
import "./globals.css";

// Αν ΚΡΑΤΑΣ το css στο /styles/globals.css, τότε χρησιμοποίησε αυτό αντί για την παραπάνω γραμμή:
// import "../styles/globals.css";

export const metadata: Metadata = {
  title: "RememberToGo",
  description: "Light scaffold that builds and deploys clean.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-3xl p-6">{children}</div>
      </body>
    </html>
  );
}
