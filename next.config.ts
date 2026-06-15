import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/resume.pdf",
        destination: "/AdityaJain.pdf",
      },
    ];
  },
};

export default nextConfig;
