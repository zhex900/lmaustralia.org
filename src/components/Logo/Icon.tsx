import React from 'react'

const Icon: React.FC<Record<string, any>> = () => {
  return (
    <div className="logo-container">
      <img src="/favicon.svg" alt="Logo" width={100} height={100} />
    </div>
  )
}

export default Icon
