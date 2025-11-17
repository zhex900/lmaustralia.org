import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-3xl font-bold ">
        LM<span className="text-orange-300">AU</span>
      </div>
      <div className="border-l-2 border-l-orange-300 text-xs text-gray-500 ">
        <div className="flex flex-col pl-2 ">
          <span>Lord's </span>
          <span>Move in</span>
          <span>Australia</span>
        </div>
      </div>
    </div>
  )
}
