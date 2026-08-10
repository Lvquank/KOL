import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next-local",
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
    ],
  },
};

export default nextConfig;
