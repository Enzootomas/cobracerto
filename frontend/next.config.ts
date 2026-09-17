import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination:
          "http://10.109.3.96:8000/:path*",
      },
    ];
  },
};

export default nextConfig;