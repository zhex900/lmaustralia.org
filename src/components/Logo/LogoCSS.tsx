import React from 'react'

const Logo: React.FC<Record<string, any>> = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="text-3xl font-bold">
        LM<span className="text-orange-300">AU</span>
      </div>
      <div className="border-l-2 border-l-orange-300 text-xs text-gray-500">
        <div className="flex flex-col pl-2">
          <span>Lord&apos;s </span>
          <span>Move in</span>
          <span>Australia</span>
        </div>
      </div>
    </div>
  )
}

export default Logo
