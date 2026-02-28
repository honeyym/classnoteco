/**
 * Sentry error monitoring and performance.
 * Initialize as early as possible in the app lifecycle.
 *
 * Required env: VITE_SENTRY_DSN (from Sentry project settings)
 * Optional: VITE_SENTRY_ENVIRONMENT (e.g. production, staging)
 */
import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_SENTRY_DSN;
const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE;

if (dsn) {
  Sentry.init({
    dsn,
    environment,
    integrations: [
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect: (effect) => effect(),
      }),
    ],
    tracesSampleRate: environment === "production" ? 0.1 : 1.0,
  });
}

export { Sentry };
