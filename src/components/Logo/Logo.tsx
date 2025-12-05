import React from 'react'

export const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-3xl font-bold">
        LM<span className="dark:text-amber-200 text-teal-800">AU</span>
      </div>
      <div className="border-l-2 dark:border-l-stone-50 border-l-stone-900 text-xs text-gray-500">
        <div className="flex flex-col pl-2 dark:text-amber-200 text-teal-800">
          <span>Lord&apos;s </span>
          <span>Move in</span>
          <span>Australia</span>
        </div>
      </div>
    </div>
  )
}
