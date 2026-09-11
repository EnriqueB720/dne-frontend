// Sentry initialization for the browser bundle. Runs on every page load.
// Silent when NEXT_PUBLIC_SENTRY_DSN isn't set (local dev unchanged).
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    // 10% of client transactions in prod — safe overhead, respects
    // Sentry free-tier quota. Bump if you need more visibility.
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Session replay: capture 10% of sessions, and 100% of sessions
    // that included an error (huge value for debugging user reports).
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration({
        // Mask user text and inputs by default — no accidental
        // password/PII leaks in the replay footage.
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}
