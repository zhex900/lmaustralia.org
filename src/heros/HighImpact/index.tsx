import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { AustraliaMap } from '@/components/Maps'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="min-h-screen relative flex items-end">
      <div className="absolute w-[95%] sm:w-[90%] md:w-[85%] lg:w-[70%] xl:w-[50%] 2xl:w-[45%] z-0 left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2  pointer-events-none">
        <AustraliaMap>
          {richText && (
            <div className=" max-w-3xl">
              <RichText className="mt-30 mx-10" data={richText} enableGutter={false} />
              <div className="z-10 absolute -bottom-8 left-0 w-full flex items-center justify-center">
                {Array.isArray(links) && links.length > 0 && (
                  <ul className="flex justify-between w-[70%] md:w-[60%] lg:w-[50%]">
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
          )}
        </AustraliaMap>
      </div>

      {media && typeof media === 'object' && (
        <Media fill imgClassName="-z-10 object-cover" resource={media} />
      )}
    </div>
  )
}
