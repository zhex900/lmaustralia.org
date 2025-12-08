import React from 'react'

// amber-200 #fde68a
const Logo: React.FC<Record<string, any>> = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#219187', // teal-950
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          fontSize: '2.5rem', // text-2xl
          fontWeight: 'bold',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {'LMAU'.split('').map((letter, index) => (
          <span key={index} style={{ lineHeight: 1 }}>
            {letter}
          </span>
        ))}
      </div>
      <div
        style={{
          width: '100%',
          height: '2px',
          backgroundColor: '#fbbf24', // amber-400
          marginTop: '0.25rem',
          marginBottom: '0.25rem',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
      <div
        style={{
          fontSize: '1rem',
          textAlign: 'center',
        }}
      >
        LORD&apos;S MOVE IN AUSTRALIA
      </div>
    </div>
  )
}

export default Logo
