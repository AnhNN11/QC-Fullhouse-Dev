import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/local-crawl": ["./scripts/crawl-sessions.mjs"],
  },
};

export default nextConfig;
