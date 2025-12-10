import { cn } from '@/utilities/ui'
import React from 'react'

import { Timeline, TimelineEntry } from '@/components/ui/timeline'
export type TimelineBlockProps = {
  title: string
  description: string
  timeline: TimelineEntry[]
}

export const TimelineBlock: React.FC<TimelineBlockProps> = ({ title, description, timeline }) => {
  return (
    <div className={cn('mx-auto w-full')}>
      <Timeline title={title} description={description} timeline={timeline} />
    </div>
  )
}
