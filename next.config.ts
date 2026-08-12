import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next-local",
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.hn-1.cloud.cmctelecom.vn",
      },
      {
        protocol: "https",
        hostname: "kol.gov.vn",
      },
      {
        protocol: "https",
        hostname: "*.vnecdn.net",
      },
      {
        protocol: "https",
        hostname: "cdn.netspace.vn",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
