'use client'

import { useEffect } from 'react'

/**
 * Lazy loads Sentry on the client side to improve initial page load performance.
 * Only loads in production environment.
 */
export function SentryLoader() {
  useEffect(() => {
    // Only load Sentry in production
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    // Dynamically import Sentry to avoid blocking initial page load
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.init({
        dsn: 'https://ae713528eec37e17d36f73e615b271f3@o96242.ingest.us.sentry.io/4510399689654272',

        // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
        tracesSampleRate: 0.1,

        // Setting this option to true will print useful information to the console while you're setting up Sentry.
        debug: false,

        replaysOnErrorSampleRate: 1.0,

        // This sets the sample rate to be 10%. You may want this to be 100% while
        // in development and sample at a lower rate in production
        replaysSessionSampleRate: 0.1,

        // You can remove this option if you're not planning to use the Sentry Session Replay feature:
        integrations: [
          Sentry.replayIntegration({
            // Additional Replay configuration goes in here, for example:
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
      })
    })
  }, [])

  return null
}
