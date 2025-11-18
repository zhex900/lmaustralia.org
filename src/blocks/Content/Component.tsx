import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'
import { Media } from '@/components/Media'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns, className, blockName } = props
  console.log(props)
  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }
  return (
    <div
      className={cn('container', className)}
      {...(blockName ? { id: blockName.toLowerCase().replace(/ /g, '-') } : {})}
    >
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size, media, columnClassName } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]} flex flex-col`, {
                  'md:col-span-2': size !== 'full',
                  'items-center justify-center': media,
                  [columnClassName as string]: columnClassName,
                })}
                key={index}
              >
                <div
                  className={cn('flex-1', {
                    'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center justify-center':
                      media,
                    'flex flex-col': !media,
                  })}
                >
                  {media && <Media resource={media} />}
                  {richText && <RichText data={richText} enableGutter={false} />}
                </div>
                {enableLink && <CMSLink {...link} className="mt-auto" />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
