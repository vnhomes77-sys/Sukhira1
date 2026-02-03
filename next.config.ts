import type { NextConfig } from "next";

// Debug: Log environment keys available at build time
console.log('Build Environment Keys:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_') || key.startsWith('SHOPIFY_')));


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
};

export default nextConfig;
