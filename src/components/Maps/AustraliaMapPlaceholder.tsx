import React from 'react'
import { cn } from '@/utilities/ui'

type AustraliaMapPlaceholderProps = {
  className?: string
  children?: React.ReactNode
}

/**
 * Server-rendered placeholder for the map
 * This improves FCP and LCP by rendering immediately without client-side JS
 */
export const AustraliaMapPlaceholder: React.FC<AustraliaMapPlaceholderProps> = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn('relative', className)}
      style={{
        width: '100%',
        aspectRatio: '1000 / 966',
        pointerEvents: 'none',
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        aria-hidden="true"
      >
        {/* Simple SVG placeholder matching map aspect ratio */}
        <svg viewBox="0 0 1000 966" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Australia-like shape placeholder */}
          <path
            d="M200 300 L400 200 L600 250 L750 400 L800 600 L700 750 L500 850 L300 800 L150 600 Z"
            fill="#FF0000"
            fillOpacity="0.3"
            className="animate-pulse"
          />
        </svg>
        {children && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
