import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'
import { Timeline, TimelineEntry } from '@/components/ui/timeline'

export type TimelineBlockProps = {
  title: string
  description: string
  timeline: Array<{
    title: string
    content?: any
  }>
}

export const TimelineBlock: React.FC<TimelineBlockProps> = ({ title, description, timeline }) => {
  const timelineEntries: TimelineEntry[] = timeline.map((item) => ({
    title: item.title,
    content: item.content ? <RichText data={item.content} enableGutter={false} /> : null,
  }))

  return (
    <div className={cn('mx-auto w-full')}>
      <Timeline title={title} description={description} timeline={timelineEntries} />
    </div>
  )
}
