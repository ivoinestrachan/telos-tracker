import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/event',
        destination: '/call',
        permanent: true, // 308 permanent redirect
      },
    ];
  },
};

export default nextConfig;
