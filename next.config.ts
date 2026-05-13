import type { NextConfig } from "next";

const BACKEND_URL = "https://api-proyectolector.onrender.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Cualquier petición a /api-proxy/... se reenvía al backend real
        // El servidor Next.js hace la petición (sin CORS), no el browser
        source: "/api-proxy/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
