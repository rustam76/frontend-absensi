import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['absensi.pixelcode.my.id'],
  },
  eslint: {
    ignoreDuringBuilds: true, 
  }
};

export default nextConfig;