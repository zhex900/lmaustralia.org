import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { withPayload } from '@payloadcms/next/withPayload'
import { withSentryConfig } from '@sentry/nextjs'

import redirects from './redirects.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    qualities: [75, 85],
    formats: ['image/avif', 'image/webp'],
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        hostname: 'localhost',
        protocol: 'http',
        port: '3000',
      },
      {
        hostname: '127.0.0.1',
        protocol: 'http',
        port: '3000',
      },
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].filter(Boolean).map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=0',
          },
        ],
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1gb',
    },
  },
}

// Wrap with Payload first
const configWithPayload = withPayload(nextConfig, { devBundleServerPackages: false })

// Only wrap with Sentry in production
export default process.env.NODE_ENV === 'production'
  ? withSentryConfig(
      configWithPayload,
      {
        // For all available options, see:
        // https://www.npmjs.com/package/@sentry/webpack-plugin#options

        org: 'jakehe',
        project: 'lmaustralia-org',

        // Only print logs for uploading source maps in CI
        silent: !process.env.CI,

        // Disable telemetry to prevent errors (as shown in error message)
        telemetry: false,
      },
      {
        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces (increases build time)
        widenClientFileUpload: true,

        // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
        // This can increase your server load as well as your hosting bill.
        // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
        // side errors will fail.
        tunnelRoute: '/monitoring',

        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true,

        // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
        // See the following for more information:
        // https://docs.sentry.io/product/crons/
        // https://vercel.com/docs/cron-jobs
        automaticVercelMonitors: true,
      },
    )
  : configWithPayload
