import { cn } from '@/utilities/ui'
import React from 'react'
import { NewcastleMap } from '@/components/Maps'

export const ProximityMapBlock: React.FC<{}> = () => {
  return (
    <div className={cn('mx-auto mt-8 mb-30 md:mb-5 w-full')}>
      <NewcastleMap />
    </div>
  )
}
