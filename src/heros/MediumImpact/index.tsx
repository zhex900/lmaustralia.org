import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const MediumImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  richText,
  backgroundClass,
}) => {
  return (
    <div className="px-2 md:px-4 lg:px-6 relative">
      <div className="container flex items-end">
        <div className="z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
          <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
            {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
            {Array.isArray(links) && links.length > 0 && (
              <ul className="flex gap-4">
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

        <div className="min-h-[28vh] select-none ">
          <div className={cn(backgroundClass, 'absolute top-0 left-0 w-full h-full')}></div>
          {media && typeof media === 'object' && (
            <>
              <Media fill imgClassName="-z-10 object-cover brightness-50" resource={media} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
