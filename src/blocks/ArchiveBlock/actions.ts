'use server'

import type { Payload } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const getPosts = async (
  payload: Payload,
  options: {
    limit?: number
    categories?: number[]
  },
) => {
  const { limit = 10, categories } = options

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit,
    ...(categories && categories.length > 0
      ? {
          where: {
            categories: {
              in: categories,
            },
          },
        }
      : {}),
  })

  return posts
}

export const fetchArchivePosts = async (options: { limit?: number; categories?: number[] }) => {
  const payload = await getPayload({ config: configPromise })
  return getPosts(payload, options)
}
