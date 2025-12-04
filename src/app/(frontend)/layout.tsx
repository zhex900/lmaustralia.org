import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Playfair_Display, Montserrat } from 'next/font/google'
import React from 'react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import { SentryLoader } from '@/components/SentryLoader'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  weight: ['400', '600'],
  subsets: ['latin', 'latin-ext'],
})
const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'latin-ext'],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(playfairDisplay.variable, montserrat.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="bg-linear-to-r from-amber-100 to-teal-100  dark:from-sky-950 dark:to-teal-800 flex flex-col min-h-screen">
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          <main className="flex-1">{children}</main>
          {/* Debug breakpoint badge (dev only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-2 right-2 z-50 rounded bg-black/70 text-white px-2 py-1 text-xs">
              <span className="block sm:hidden">base</span>
              <span className="hidden sm:block md:hidden">sm</span>
              <span className="hidden md:block lg:hidden">md</span>
              <span className="hidden lg:block xl:hidden">lg</span>
              <span className="hidden xl:block 2xl:hidden">xl</span>
              <span className="hidden 2xl:block">2xl</span>
            </div>
          )}
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
        <SentryLoader />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
