import { getApiRewriteTarget } from "./src/lib/apiConfig.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img105.savana.com" },
    ],
  },
  async rewrites() {
    const apiTarget = getApiRewriteTarget();

    if (!apiTarget) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${apiTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
