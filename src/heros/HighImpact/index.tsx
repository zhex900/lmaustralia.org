import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { AustraliaMap } from '@/components/Maps'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media }) => {
  const andSymbolClassName = 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl'
  return (
    <div className="">
      <div className="min-h-[calc(100dvh-112px)] h-auto flex items-center justify-center">
        <div className="min-h-[calc(100dvh-112px)] h-auto px-5  flex flex-col items-center justify-between ">
          <div className="flex-1 flex flex-col items-center justify-center w-full z-0 pointer-events-none min-h-0">
            <AustraliaMap className="">
              <TextGenerateEffect className="px-4 md:px-10 lg:px-15 text-center font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl absolute -translate-y-1/4">
                Be fruitful <span className={andSymbolClassName}>&</span> multiply,{' '}
                <span className={andSymbolClassName}>&</span>{' '}
                <span className="text-amber-200 dark:text-teal-700 whitespace-nowrap">
                  fill the earth
                </span>
              </TextGenerateEffect>
            </AustraliaMap>
          </div>
          <div className="flex-1 flex flex-col items-center justify-around">
            <div className="text-center px-4">
              Learn more about the fresh burden for migration for the Lord’s move in Australia and
              how you can get involved
            </div>
            <div className=" flex items-center justify-center">
              {Array.isArray(links) && links.length > 0 && (
                <ul className="flex justify-center gap-40">
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
        </div>
      </div>

      {media && typeof media === 'object' && (
        <Media fill imgClassName="-z-10 object-cover" resource={media} />
      )}
    </div>
  )
}
