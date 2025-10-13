// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-friendly (καλύτερα stacktraces στα Vercel Functions)
  experimental: { serverSourceMaps: true },

  // Καλύτερη συμπεριφορά στο React
  reactStrictMode: true,

  // Επιτρέπει εικόνες από Supabase storage
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },

  // Ασφαλέστερο referrer policy για MapLibre/tiles fetch/xhr
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }],
      },
    ];
  },

  // Κράτα τα strict για production πειθαρχία (μην αγνοείς σφάλματα)
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
