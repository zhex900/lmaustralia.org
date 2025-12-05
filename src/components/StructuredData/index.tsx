import React from 'react'
import { getServerSideURL } from '@/utilities/getURL'
import { site } from '@/constants'
import type { Page, Post } from '@/payload-types'

type StructuredDataProps = {
  doc: Partial<Page> | Partial<Post> | null
}

export const StructuredData: React.FC<StructuredDataProps> = ({ doc }) => {
  if (!doc) return null

  const serverUrl = getServerSideURL()
  const isPost = doc && 'categories' in doc
  const slug = Array.isArray(doc?.slug) ? doc.slug.join('/') : doc?.slug || ''
  const url = slug === 'home' ? serverUrl : `${serverUrl}/${slug}`
  const title = doc?.meta?.title || doc?.title || site.title
  const description = doc?.meta?.description || site.description
  const image =
    doc?.meta?.image && typeof doc.meta.image === 'object' && 'url' in doc.meta.image
      ? `${serverUrl}${doc.meta.image.url}`
      : `${serverUrl}/website-template-OG.webp`

  // Type guard to check if doc is a Post
  const postDoc = isPost ? (doc as Partial<Post>) : null
  const categories = postDoc?.categories

  // Organization structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: serverUrl,
    logo: `${serverUrl}/favicon.svg`,
    description: site.description,
    email: site.email,
    sameAs: [
      // Add social media URLs here when available
      // 'https://www.facebook.com/...',
      // 'https://twitter.com/...',
    ],
  }

  // Article schema for blog posts
  const articleSchema =
    isPost && 'createdAt' in doc && doc.createdAt
      ? (() => {
          const articleSection =
            categories && Array.isArray(categories) && categories.length > 0
              ? (categories as Array<unknown>)
                  .filter(
                    (cat): cat is { title: string } =>
                      typeof cat === 'object' && cat !== null && 'title' in cat,
                  )
                  .map((cat) => cat.title)
                  .join(', ')
              : undefined

          return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            description,
            image: image,
            datePublished: new Date(doc.createdAt).toISOString(),
            dateModified: doc.updatedAt
              ? new Date(doc.updatedAt).toISOString()
              : new Date(doc.createdAt).toISOString(),
            author: {
              '@type': 'Organization',
              name: site.name,
            },
            publisher: {
              '@type': 'Organization',
              name: site.name,
              logo: {
                '@type': 'ImageObject',
                url: `${serverUrl}/favicon.svg`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': url,
            },
            ...(articleSection ? { articleSection } : {}),
          }
        })()
      : null

  // WebPage schema
  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    image: image,
    inLanguage: 'en-AU',
    isPartOf: {
      '@type': 'WebSite',
      name: site.name,
      url: serverUrl,
    },
    about: {
      '@type': 'Organization',
      name: site.name,
    },
  }

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: serverUrl,
      },
      ...(slug && slug !== 'home'
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: title,
              item: url,
            },
          ]
        : []),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
