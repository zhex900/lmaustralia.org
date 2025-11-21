import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Only load Sentry configs in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('../sentry.server.config');
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('../sentry.edge.config');
    }
  }
}

// Export request error handler (no-op if Sentry not initialized)
export const onRequestError = process.env.NODE_ENV === 'production' 
  ? Sentry.captureRequestError 
  : () => {};
