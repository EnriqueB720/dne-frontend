import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  // Emit a minimal self-contained server bundle at .next/standalone so
  // the runtime Docker layer can copy just what's needed to run —
  // without dragging along the whole node_modules tree. Node runs it via
  // `node server.js`. Zero effect on local `next dev`.
  output: 'standalone',
};

// Sentry's Next.js integration:
//  - Uploads client-bundle sourcemaps to Sentry at build time so stack
//    traces in the dashboard show real function/line names instead of
//    minified nonsense. Requires SENTRY_AUTH_TOKEN in Railway build env.
//  - Silent no-op when SENTRY_DSN / SENTRY_AUTH_TOKEN are missing —
//    local dev and PR previews build cleanly without any Sentry setup.
//  - `hideSourceMaps` keeps the sourcemap files out of the public
//    /_next/static bundle so they aren't served to end users.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI, // suppress noisy logs during local next build
  // Upload sourcemaps to Sentry (so stack traces are readable) but
  // delete them from the client bundle after upload so end users
  // never receive the mapping files.
  sourcemaps: { deleteSourcemapsAfterUpload: true },
  disableLogger: true,
});
