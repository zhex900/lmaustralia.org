import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { AustraliaMap } from '@/components/Maps'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media }) => {
  const andSymbolClassName = 'text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl'
  return (
    <div className="">
      <div className="min-h-[calc(100dvh-112px)] h-auto flex items-center justify-center">
        <div className="min-h-[calc(100dvh-112px)] h-auto px-5 flex flex-col items-center justify-between ">
          <div className="z-0 -mt-15 flex-1 flex flex-col items-center justify-center w-full sm:w-[90%] md:w-[70%] xl:w-[75%] pointer-events-none min-h-0">
            <AustraliaMap className="px-1">
              <TextGenerateEffect className="px-10 lg:px-15 text-center font-playfair font-semibold text-2xl sm:text-4xl md:text-5xl xl:text-6xl absolute -translate-y-1/4">
                Be fruitful <span className={andSymbolClassName}>&</span> multiply,{' '}
                <span className={andSymbolClassName}>&</span>{' '}
                <span className="animate text-amber-200 dark:text-teal-700 whitespace-nowrap">
                  fill the earth
                </span>
              </TextGenerateEffect>
            </AustraliaMap>
          </div>
          <div className="-mt-20 flex-1 flex flex-col items-center justify-around">
            <div className="text-center px-4">
              Learn more about the fresh burden for migration for the Lord’s move in Australia and
              how you can get involved
            </div>
            <div className="flex items-center justify-center w-full">
              {Array.isArray(links) && links.length > 0 && (
                <ul className="flex justify-between gap-10 min-w-1/2">
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
