import React from 'react'

import './logo.scss'

const Logo: React.FC<Record<string, any>> = () => {
  return (
    <div className="logo-container">
      <div className="logo-main">
        LM<span className="logo-accent">AU</span>
      </div>
      <div className="logo-subtitle">
        <div className="logo-subtitle-content">
          <span>Lord&apos;s </span>
          <span>Move in</span>
          <span>Australia</span>
        </div>
      </div>
    </div>
  )
}

export default Logo
