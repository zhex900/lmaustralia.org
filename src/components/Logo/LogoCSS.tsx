import React from 'react'

const Logo: React.FC<Record<string, any>> = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>
        LM<span style={{ color: '#fdba74' }}>AU</span>
      </div>
      <div
        style={{
          borderLeft: '2px solid #fdba74',
          fontSize: '0.90rem',
          color: '#6b7280',
        }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', paddingLeft: '8px', color: '#fdba74' }}
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
