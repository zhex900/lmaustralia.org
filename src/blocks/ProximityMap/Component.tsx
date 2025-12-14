import { cn } from '@/utilities/ui'
import React from 'react'
import { NewcastleMap } from '@/components/Maps'

export const ProximityMapBlock: React.FC<{}> = () => {
  return (
    <div className={cn('mx-auto mt-8 mb-50 md:mb-5 w-full')}>
      <NewcastleMap />
    </div>
  )
}
