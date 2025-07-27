import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude CLI directory from Next.js processing
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config) => {
    // Ignore CLI test files during build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/cli/tests/**', '**/cli/jest.config.js'],
    };
    return config;
  },
};

export default nextConfig;
