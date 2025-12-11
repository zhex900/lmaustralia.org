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
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    qualities: [100, 75],
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
  serverExternalPackages: [
    '@payloadcms/storage-vercel-blob',
    '@payloadcms/plugin-seo',
    '@payloadcms/richtext-lexical',
    'payload-lexical-typography',
    'payload-authjs',
  ],
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-select',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
    ],
  },
  transpilePackages: ['@payloadcms/ui'],
}

const configWithPayload = withPayload(nextConfig, { devBundleServerPackages: false })

export default process.env.NODE_ENV === 'production'
  ? withSentryConfig(
      configWithPayload,
      {
        org: 'jakehe',
        project: 'lmaustralia-org',
        silent: !process.env.CI,
        telemetry: false,
      },
      {
        widenClientFileUpload: true,
        tunnelRoute: '/monitoring',
        disableLogger: true,
        automaticVercelMonitors: true,
      },
    )
  : configWithPayload
