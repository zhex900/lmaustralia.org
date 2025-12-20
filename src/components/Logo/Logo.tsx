import React from 'react'
import { cn } from '@/utilities/ui'

export const Logo = ({ darkMode = false }: { darkMode?: boolean }) => {
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center ',
        darkMode && 'text-stone-50',
        !darkMode && 'text-[var(--title-text)] dark:text-stone-50',
      )}
    >
      <div className="flex flex-1 justify-between text-2xl md:text-3xl font-bold text-center w-full">
        {'LMAU'.split('').map((letter, index) => (
          <span key={index} className="leading-none">
            {letter}
          </span>
        ))}
      </div>
      <div className="w-full h-[2px] bg-amber-400 my-1 mx-auto" />
      <div className="text-[0.45rem] md:text-xs text-center">LORD&apos;S MOVE IN AUSTRALIA</div>
    </div>
  )
}
