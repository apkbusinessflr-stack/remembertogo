import './globals.css';
import Nav from '@/components/Nav';

export const metadata = {
  title: 'MapQuest — remembertogo.com',
  description: 'Global travel map — MapQuest Full'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container py-6">
          <Nav />
          {children}
          <footer className="mt-10 text-xs opacity-70">© {new Date().getFullYear()} MapQuest • remembertogo.com</footer>
        </div>
      </body>
    </html>
  );
}
