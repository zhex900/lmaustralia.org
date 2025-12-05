import React from 'react'

// amber-200 #fde68a
const Logo: React.FC<Record<string, any>> = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>
        LM<span style={{ color: '#fde68a' }}>AU</span>
      </div>
      <div
        style={{
          borderLeft: '2px solid #fff',
          fontSize: '0.90rem',
          color: '#027568',
        }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', paddingLeft: '8px', color: '#fde68a' }}
        >
          <span>Lord&apos;s </span>
          <span>Move in</span>
          <span>Australia</span>
        </div>
      </div>
    </div>
  )
}

export default Logo
