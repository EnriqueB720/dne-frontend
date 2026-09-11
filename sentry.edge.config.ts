// Sentry initialization for the Edge runtime (Next.js middleware,
// edge routes). Same DSN as the server config; Edge just uses a
// stripped-down subset of the SDK.
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });
}
