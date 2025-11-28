import React from 'react'

const Icon: React.FC<Record<string, any>> = () => {
  return (
    <div className="flex items-center gap-2">
      <img src="/favicon.svg" alt="Logo" width={100} height={100} />
    </div>
  )
}

export default Icon
