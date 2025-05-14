import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // Allow images from localhost
  },
  staticPageGenerationTimeout: 60, // Optional: Increase timeout for static generation
  async rewrites() {
    return [
      {
        source: '/sessions/:sessionCode/leaderboard',
        destination: '/api/sessions/:sessionCode/leaderboard',
      },
      {
        source: '/sessions/:sessionCode',
        destination: '/api/sessions/:sessionCode',
      },
    ];
  },
};

export default nextConfig;
