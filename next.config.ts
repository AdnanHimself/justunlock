import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino', 'thread-stream'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'tap': false,
      'why-is-node-running': false,
      'pino-elasticsearch': false,
      'fastbench': false,
      'sonic-boom': false,
      'desm': false,
    };
    return config;
  },
};

export default nextConfig;
