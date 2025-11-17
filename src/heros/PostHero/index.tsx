import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Category, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { Maps } from '@/components/Maps/Index'
import { AustraliaMap } from '@/components/Maps/AustraliaMap'
import { cn } from '@/utilities/ui'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title, slug } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  console.log(post)
  //what category is the post in?
  const category = categories?.[0] as Category
  const mapWrapperClassName = cn(
    'absolute ',
    'w-[20%] right-10 bottom-0',
    // 'sm:w-[95%] sm:-top-28',
    // 'md:w-[67%] md:left-[8rem] md:translate-x-0 md:-top-[10rem]',
    // 'lg:w-[67%] lg:left-[16em] lg:-top-[13em]',
    // 'xl:w-[90%] xl:left-[3em] xl:-top-[10em]',
    // '2xl:w-[70%] 2xl:left-[10em] 2xl:-top-[1em]',
  )
  const isCity = category?.slug === 'cities'
  return (
    <div className="relative flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {hasAuthors && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Author</p>

                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>

                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-[28vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <>
            <Media
              fill
              priority
              imgClassName="-z-10 object-cover brightness-50"
              resource={heroImage}
            />
          </>
        )}
        {isCity && (
          <div className="absolute w-[20%] right-10 bottom-2">
            <Maps slug={slug} />
          </div>
        )}
      </div>
    </div>
  )
}
