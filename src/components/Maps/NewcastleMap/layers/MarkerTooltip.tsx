import React from 'react'

type MarkerTooltipProps = {
  showTooltip?: boolean // Optional - if provided, use controlled mode
  children: React.ReactNode
  wrapperClassName: string
  tooltipClassName: string
}

export const MarkerTooltip: React.FC<MarkerTooltipProps> = ({
  showTooltip,
  children,
  wrapperClassName,
  tooltipClassName,
}) => {
  // If showTooltip is provided, use controlled mode (inline style)
  // Otherwise, use CSS hover (default behavior)
  const isControlled = showTooltip !== undefined
  const opacity = isControlled ? (showTooltip ? 1 : 0) : 0

  return (
    <>
      {!isControlled && (
        <style>{`
          .${wrapperClassName}:hover .${tooltipClassName} {
            opacity: 1 !important;
          }
        `}</style>
      )}
      <div
        className={tooltipClassName}
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
          padding: '6px 10px',
          //teal-400
          backgroundColor: 'rgba(2, 117, 104, 0.8)',
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity,
          transition: 'opacity 0.2s ease-in-out',
          zIndex: 99,
        }}
      >
        {children}
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            zIndex: 99,
            transform: 'translateX(-50%)',
            border: '4px solid transparent',
            borderTopColor: 'rgba(2, 117, 104, 0.8)',
          }}
        />
      </div>
    </>
  )
}
