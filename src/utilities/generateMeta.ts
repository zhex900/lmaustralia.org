import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { site } from '@/constants'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

const getCanonicalURL = (slug?: string | string[] | null): string => {
  const serverUrl = getServerSideURL()

  if (!slug || slug === 'home') {
    return serverUrl
  }

  const slugPath = Array.isArray(slug) ? slug.join('/') : slug
  return `${serverUrl}/${slugPath}`
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  if (!doc) {
    return {
      title: site.title,
      description: site.description,
    }
  }

  const ogImage = getImageURL(doc?.meta?.image)
  const canonicalURL = getCanonicalURL(doc?.slug)
  const title = doc?.meta?.title ? `${doc.meta.title} | ${site.name}` : site.title
  const description = doc?.meta?.description || site.description
  const isPost = 'categories' in doc

  // Build keywords from categories if available
  // Note: keywords field may not exist in meta, so we check for it safely
  const metaKeywords =
    doc?.meta && 'keywords' in doc.meta ? (doc.meta as { keywords?: string }).keywords : undefined
  const keywords =
    metaKeywords ||
    (isPost && 'categories' in doc && Array.isArray(doc.categories)
      ? (doc.categories as Array<unknown>)
          .filter(
            (cat): cat is { title: string } =>
              typeof cat === 'object' && cat !== null && 'title' in cat,
          )
          .map((cat) => cat.title)
          .join(', ')
      : undefined)

  // Safely check for noIndex and noFollow properties
  const metaWithRobots =
    doc?.meta && ('noIndex' in doc.meta || 'noFollow' in doc.meta)
      ? (doc.meta as { noIndex?: boolean; noFollow?: boolean })
      : null

  return {
    title,
    description,
    keywords: keywords ? [keywords] : undefined,
    authors:
      isPost && 'authors' in doc && Array.isArray(doc.authors)
        ? doc.authors
            .filter((author) => typeof author === 'object' && author !== null)
            .map((author) => ({
              name: 'name' in author ? (author.name as string) : 'Unknown Author',
            }))
        : [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    metadataBase: new URL(getServerSideURL()),
    alternates: {
      canonical: canonicalURL,
    },
    openGraph: mergeOpenGraph({
      title,
      description,
      url: canonicalURL,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: doc?.meta?.title || site.title,
            },
          ]
        : undefined,
      type: isPost ? 'article' : 'website',
      publishedTime:
        isPost && 'createdAt' in doc && doc.createdAt
          ? new Date(doc.createdAt).toISOString()
          : undefined,
      modifiedTime: doc?.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
      section:
        isPost && 'categories' in doc && Array.isArray(doc.categories) && doc.categories.length > 0
          ? (() => {
              const firstCat = doc.categories[0]
              return typeof firstCat === 'object' && firstCat !== null && 'title' in firstCat
                ? (firstCat as { title: string }).title
                : undefined
            })()
          : undefined,
      tags: keywords ? keywords.split(', ') : undefined,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: '@lmaustralia',
      site: '@lmaustralia',
    },
    robots: {
      index: metaWithRobots?.noIndex !== true,
      follow: metaWithRobots?.noFollow !== true,
      googleBot: {
        index: metaWithRobots?.noIndex !== true,
        follow: metaWithRobots?.noFollow !== true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'article:author': site.name,
      ...(isPost && 'createdAt' in doc && doc.createdAt
        ? { 'article:published_time': new Date(doc.createdAt).toISOString() }
        : {}),
      ...(doc?.updatedAt ? { 'article:modified_time': new Date(doc.updatedAt).toISOString() } : {}),
    },
  }
}
