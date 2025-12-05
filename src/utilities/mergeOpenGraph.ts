import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { site } from '@/constants'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  locale: 'en_AU',
  description: site.description,
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
      width: 1200,
      height: 630,
      alt: site.title,
    },
  ],
  siteName: site.name,
  title: site.title,
  url: getServerSideURL(),
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  // Normalize images to array format
  const normalizedImages = og?.images
    ? Array.isArray(og.images)
      ? og.images.length > 0
        ? og.images
        : defaultOpenGraph.images
      : [og.images] // Convert single image to array
    : defaultOpenGraph.images

  return {
    ...defaultOpenGraph,
    ...og,
    // Merge images array properly, preferring provided images
    images: normalizedImages,
    // Ensure URL is always set
    url: og?.url || defaultOpenGraph.url,
    // Ensure title and description are set
    title: og?.title || defaultOpenGraph.title,
    description: og?.description || defaultOpenGraph.description,
  }
}
