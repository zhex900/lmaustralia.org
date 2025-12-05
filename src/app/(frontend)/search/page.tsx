import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'
import { site } from '@/constants'

type Args = {
  searchParams: Promise<{
    q?: string
  }>
}
export default async function Page({ searchParams }: Args) {
  const { q: query } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-200 mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export async function generateMetadata({ searchParams }: Args): Promise<Metadata> {
  const { q: query } = await searchParams
  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')

  const title = query ? `Search results for "${query}" | ${site.name}` : `Search | ${site.name}`
  const description = query
    ? `Search results for "${query}" on ${site.name}`
    : `Search ${site.name} for posts, articles, and content.`

  return {
    title,
    description,
    robots: {
      index: false, // Don't index search pages
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${serverUrl}/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `${serverUrl}/search`,
    },
  }
}
