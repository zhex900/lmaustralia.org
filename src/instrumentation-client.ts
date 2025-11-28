// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// NOTE: Sentry is now lazy-loaded via SentryLoader component in layout.tsx
// This file is kept for compatibility but initialization is disabled here
// to allow for lazy loading and improved initial page load performance.

import * as Sentry from '@sentry/nextjs'

// Disabled: Sentry is now lazy-loaded via <SentryLoader /> component
// Only initialize Sentry in production
// if (process.env.NODE_ENV === 'production') {
//   Sentry.init({
//     dsn: 'https://ae713528eec37e17d36f73e615b271f3@o96242.ingest.us.sentry.io/4510399689654272',
//     tracesSampleRate: 0.1,
//     debug: false,
//     replaysOnErrorSampleRate: 1.0,
//     replaysSessionSampleRate: 0.1,
//     integrations: [
//       Sentry.replayIntegration({
//         maskAllText: true,
//         blockAllMedia: true,
//       }),
//     ],
//   })
// }

// Export router transition hook for navigation instrumentation (no-op if Sentry not initialized)
export const onRouterTransitionStart =
  process.env.NODE_ENV === 'production' ? Sentry.captureRouterTransitionStart : () => {}
