import type { NextConfig } from "next";
import { crawlerRuntimeFiles } from "./scripts/lib/crawler-runtime-files.mjs";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/local-crawl": ["./scripts/**/*.mjs", "./lib/fullhouse-cookie.mjs", ...crawlerRuntimeFiles(process.cwd())],
  },
};

export default nextConfig;
