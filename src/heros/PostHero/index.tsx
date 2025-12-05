import React from 'react'
import { cn } from '@/utilities/ui'
import type { Category, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { CityMap } from '@/components/Maps'
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, backgroundClass, title, slug } = post

  //what category is the post in?
  const category = categories?.[0] as Category
  const isCity = category?.slug === 'cities'
  return (
    <div className="relative flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>
        </div>
      </div>

      <div className="min-h-[28vh] select-none">
        <div className={cn(backgroundClass, 'absolute top-0 left-0 w-full h-full')}></div>
        {heroImage && typeof heroImage !== 'string' ? (
          <Media fill imgClassName="-z-10 object-cover brightness-70" resource={heroImage} />
        ) : (
          <BackgroundGradientAnimation containerClassName="absolute top-0 left-0 w-full h-full" />
        )}
        {isCity && (
          <div className="absolute w-[20%] 2xl:w-[15%] right-10 2xl:right-1/4 bottom-2">
            <CityMap slug={slug} />
          </div>
        )}
      </div>
    </div>
  )
}
