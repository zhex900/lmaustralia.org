import { cn } from '@/utilities/ui'
import au from './au.svg'
import React from 'react'
import NextImage from 'next/image'
import { PinName, pinPositions } from './pins'

const aspectRatio = {
  width: 1000,
  height: 966,
}

type AustraliaMapProps = {
  showPinLabel?: boolean
  width?: string
  className?: string
  // which pins to show, default is all
  pins?: 'all' | PinName[]
  debug?: boolean
}

export const AustraliaMap = React.forwardRef<HTMLDivElement, AustraliaMapProps>(
  (
    {
      showPinLabel = true,
      width = '100%',
      className,
      pins = 'all',
      debug = false,
    }: AustraliaMapProps,
    ref,
  ) => {
    return (
      <div className="relative pointer-events-none">
        <div
          ref={ref}
          className={cn('relative', debug && 'border border-dashed border-red-500', className)}
          style={{
            // Maintain aspect ratio of the source (1000 x 966)
            width,
            height: '100%',
            aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}`,
            pointerEvents: 'none',
          }}
        >
          {/* SVG image - optimized for LCP with priority loading */}
          {/* Using Next.js Image ensures it's discoverable in HTML and optimized */}
          <NextImage
            src={au}
            alt="Australia map"
            fill
            sizes={`${width === '100%' ? '100vw' : width}`}
            className="object-contain"
            style={{
              position: 'absolute',
              zIndex: 0,
            }}
          />
          {/* Colored background with mask - maintains original visual effect */}
          <div
            className="absolute inset-0 bg-orange-200/60 dark:bg-red-500/60"
            aria-hidden="true"
            style={{
              zIndex: 1,
              WebkitMaskImage: `url(${au.src})`,
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskImage: `url(${au.src})`,
              maskRepeat: 'no-repeat',
              maskSize: 'contain',
              maskPosition: 'center',
            }}
          />
        </div>

        {debug && (
          <div className="pointer-events-none absolute inset-0">
            {/* Vertical line */}
            <span className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-red-500/60"></span>
            {/* Horizontal line */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-red-500/60"></span>
          </div>
        )}

        {pinPositions
          .filter((pin) => pins === 'all' || (Array.isArray(pins) && pins.includes(pin.name)))
          .map((pin) => (
            <span
              key={pin.name}
              className="absolute pointer-events-none"
              style={{
                left: `${(pin.coords.x / aspectRatio.width) * 100}%`,
                top: `${(pin.coords.y / aspectRatio.height) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="relative inline-flex items-center justify-center w-10 h-10">
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-500/40 dark:bg-slate-200/40 animate-ping"></span>
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-600 dark:bg-slate-300 animate-pulse"></span>
                {showPinLabel && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm whitespace-nowrap">
                    {pin.name}
                  </span>
                )}
              </span>
            </span>
          ))}
      </div>
    )
  },
)

AustraliaMap.displayName = 'AustraliaMap'
