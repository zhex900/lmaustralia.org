'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { AustraliaMap } from '@/components/Maps/AustraliaMap'
import { cn } from '@/utilities/ui'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    // setHeaderTheme('dark')
  })

  //w-[67%] left-[16em] -top-[13em]
  const mapWrapperClassName = cn(
    'absolute z-0 pointer-events-none',
    'w-[110%] left-1/2 -translate-x-1/2 -top-24',
    'sm:w-[95%] sm:-top-28',
    'md:w-[67%] md:left-[8rem] md:translate-x-0 md:-top-[10rem]',
    'lg:w-[67%] lg:left-[12em] lg:top-[5em]',
    'xl:w-[90%] xl:left-[3em] xl:-top-[10em]',
    '2xl:w-[70%] 2xl:left-[10em] 2xl:-top-[1em]',
  )

  return (
    <div className="min-h-[100vh] relative flex items-center justify-center">
      <div className={mapWrapperClassName}>
        <AustraliaMap className="" width="100%" />
      </div>
      <div className="container mb-8 z-10 relative flex items-center justify-center">
        <div className="max-w-[36.5rem] md:text-center z-10 relative">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className=" select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
      </div>
    </div>
  )
}
