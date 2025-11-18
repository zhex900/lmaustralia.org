'use client'

import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import React, { useEffect, useState } from 'react'
import RichText from '@/components/RichText'
import { CollectionArchive } from '@/components/CollectionArchive'
import { fetchArchivePosts } from './actions'

export const ArchiveBlockClient: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = (props) => {
  const {
    blockName,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
  } = props
  const limit = limitFromProps || 3
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchPosts = async () => {
      if (populateBy === 'collection') {
        const flattenedCategories = categories?.map((category) => {
          if (typeof category === 'object') return category.id
          else return category
        })

        try {
          const result = await fetchArchivePosts({
            limit,
            categories: flattenedCategories,
          })
          setPosts(result.docs || [])
        } catch (error) {
          console.error('Failed to fetch posts:', error)
        } finally {
          setLoading(false)
        }
      } else {
        if (selectedDocs?.length) {
          const filteredSelectedPosts = selectedDocs
            .map((post) => {
              if (typeof post.value === 'object') return post.value
              return null
            })
            .filter((post): post is Post => post !== null)

          setPosts(filteredSelectedPosts)
        }
        setLoading(false)
      }
    }

    fetchPosts()
  }, [categories, limit, populateBy, selectedDocs])

  return (
    <div className="" {...(blockName ? { id: blockName.toLowerCase().replace(/ /g, '-') } : {})}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="col-span-6" key={index}>
              <article className="border border-border rounded-lg overflow-hidden bg-gray-100 h-full animate-pulse">
                <div className="relative w-full h-48 md:h-56 lg:h-64 bg-gray-200" />
                <div className="p-4">
                  <div className="h-4 w-20 bg-gray-300 rounded mb-4" />
                  <div className="h-6 w-3/4 bg-gray-300 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-300 rounded mb-1" />
                  <div className="h-4 w-5/6 bg-gray-300 rounded" />
                </div>
              </article>
            </div>
          ))}
        </div>
      ) : (
        <CollectionArchive posts={posts} colSpan={6} />
      )}
    </div>
  )
}
