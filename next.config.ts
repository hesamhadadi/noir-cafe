import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // instrumentation.ts is stable in Next.js 15 — no experimental flag needed
  // (instrumentationHook became stable in Next.js 15.0)

  // Exclude three.js from the SSR/server bundle.
  // Node.js 25 exposes a broken localStorage proxy; Three.js calls
  // localStorage.getItem() at module level → crash. Keeping three.js
  // out of the server bundle is the safest guard.
  serverExternalPackages: ["three"],
};

export default nextConfig;
