import React from 'react'

export const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-3xl font-bold">
        LM<span className="dark:text-[var(--brand-primary)] text-[var(--brand-primary)]">AU</span>
      </div>
      <div className="border-l-2 dark:border-l-stone-50 border-l-stone-900 text-xs text-gray-500">
        <div className="flex flex-col pl-2 dark:text-[var(--brand-primary)] text-[var(--brand-primary)]">
          <span>Lord&apos;s </span>
          <span>Move in</span>
          <span>Australia</span>
        </div>
      </div>
    </div>
  )
}
