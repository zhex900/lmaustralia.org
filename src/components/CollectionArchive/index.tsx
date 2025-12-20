import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
  colSpan?: number
  relationTo?: 'posts' | 'pages'
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, colSpan = 4, relationTo = 'posts' } = props

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
      {posts?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return (
            <div key={index}>
              <Card className="h-full" doc={result} relationTo={relationTo} showCategories />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
