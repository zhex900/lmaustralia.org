import React from 'react'

export const Logo = () => {
  return (
    <div className="flex flex-col justify-center items-center text-teal-950 dark:text-stone-50 ">
      <div className="flex flex-1 justify-between text-lg md:text-2xl font-bold text-center w-full">
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
