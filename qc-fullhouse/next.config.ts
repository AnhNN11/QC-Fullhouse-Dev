import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/local-crawl": ["./scripts/**/*.mjs", "./node_modules/ffmpeg-static/ffmpeg"],
  },
};

export default nextConfig;
