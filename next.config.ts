import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Force Next.js à utiliser les bindings natifs plutôt que WASM
    swcTraceProfiling: false,
  },
};

export default nextConfig;
