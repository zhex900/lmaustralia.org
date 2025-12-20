import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { AustraliaMap } from '@/components/Maps'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'

export const HighImpactHero: React.FC<Page['hero']> = ({ media }) => {
  const andSymbolClassName = 'text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl'
  return (
    <div className="min-h-[calc(100dvh-112px)] h-auto flex items-center justify-center">
      <div className="w-[90%] md:w-[65%] lg:w-[55%] xl:w-[40%] pointer-events-none min-h-0">
        <AustraliaMap className="px-1">
          <TextGenerateEffect className="text-[var(--title-text)] px-10 lg:px-15 text-center font-playfair font-semibold text-3xl sm:text-5xl absolute -translate-y-1/4">
            Be fruitful <span className={andSymbolClassName}>&</span> multiply,{' '}
            <span className={andSymbolClassName}>&</span>{' '}
            <span className="animate text-amber-200 dark:text-teal-700 whitespace-nowrap">
              fill the earth
            </span>
          </TextGenerateEffect>
        </AustraliaMap>
      </div>

      {media && typeof media === 'object' && (
        <Media fill imgClassName="-z-10 object-cover" resource={media} />
      )}
    </div>
  )
}
