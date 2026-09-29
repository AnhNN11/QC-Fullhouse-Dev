import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: { '/*': ['./scripts/judge-worker.mjs', './node_modules/quickjs-emscripten*/**/*', './node_modules/@jitl/**/*'] },
};

export default nextConfig;
