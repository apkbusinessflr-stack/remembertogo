import "./../styles/globals.css";

export const metadata = {
  title: "RememberToGo",
  description: "Light scaffold that builds and deploys clean."
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
