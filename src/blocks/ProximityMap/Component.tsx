import { cn } from '@/utilities/ui'
import React from 'react'
import { NewcastleMap } from '@/components/Maps'

type Props = {}

export const ProximityMapBlock: React.FC<Props> = () => {
  return (
    <div className={cn('mx-auto mt-8 mb-28 w-full')}>
      <NewcastleMap />
    </div>
  )
}
