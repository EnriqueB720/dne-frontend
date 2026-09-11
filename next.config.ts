import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a minimal self-contained server bundle at .next/standalone so
  // the runtime Docker layer can copy just what's needed to run —
  // without dragging along the whole node_modules tree. Node runs it via
  // `node server.js`. Zero effect on local `next dev`.
  output: 'standalone',
};

export default nextConfig;
