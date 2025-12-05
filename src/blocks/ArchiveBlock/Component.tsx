import type { Post, Page, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    blockName,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    relationTo,
    selectedDocs,
  } = props

  const limit = limitFromProps || 3

  let posts: (Post | Page)[] = []
  let collectionType: 'posts' | 'pages' = 'posts'

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })
    collectionType = relationTo || 'posts'

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedDocs = await payload.find({
      collection: collectionType,
      depth: 1,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedDocs.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedDocs = selectedDocs
        .map((doc) => {
          if (typeof doc.value === 'object') return doc.value
          return null
        })
        .filter((doc): doc is Post | Page => doc !== null)

      posts = filteredSelectedDocs

      // Determine collection type from the relationTo property of selectedDocs
      // All selected docs should be from the same collection, so we check the first one
      if (selectedDocs.length > 0 && selectedDocs[0].relationTo) {
        collectionType = selectedDocs[0].relationTo
      } else if (posts.length > 0) {
        // Fallback: Check if it's a Page by looking for 'layout' field (pages have layout, posts have content)
        collectionType = 'layout' in posts[0] ? 'pages' : 'posts'
      }
    }
  }

  return (
    <div
      className="container"
      {...(blockName ? { id: blockName.toLowerCase().replace(/ /g, '-') } : {})}
    >
      {introContent && (
        <div className="mb-16">
          <RichText className="ms-0 max-w-3xl" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} relationTo={collectionType} />
    </div>
  )
}
