import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // Allow images from localhost
  },
  staticPageGenerationTimeout: 60, // Optional: Increase timeout for static generation
};

export default nextConfig;
