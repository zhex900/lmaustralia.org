import { withPayload } from '@payloadcms/next/withPayload'
import { withSentryConfig } from '@sentry/nextjs'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // Use modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
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
  // webpack: (webpackConfig) => {
  //   webpackConfig.resolve.extensionAlias = {
  //     '.cjs': ['.cts', '.cjs'],
  //     '.js': ['.ts', '.tsx', '.js', '.jsx'],
  //     '.mjs': ['.mts', '.mjs'],
  //   }

  //   return webpackConfig
  // },
  reactStrictMode: true,
  redirects,
  experimental: {
    forceSwcTransforms: true,
    swcPlugins: [], // ensures no babel fallback
    optimizePackageImports: [
      '@payloadcms/admin-bar',
      '@vercel/analytics',
      '@vercel/speed-insights',
      'lucide-react',
      '@radix-ui/react-select',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-label',
    ],
  },
  // Optimize CSS loading
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // Disable source maps in production to reduce bundle size
  productionBrowserSourceMaps: false,
  // Optimize output
  poweredByHeader: false,
  compress: true,
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
