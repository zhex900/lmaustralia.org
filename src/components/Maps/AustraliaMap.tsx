import React from 'react'
import * as d3 from 'd3-geo'
import { cn } from '@/utilities/ui'
import { PinName, pinPositions } from './pins'
import { SVG_WIDTH, SVG_HEIGHT } from './constants'
import australiaGeoJSON from './geojson/australia.json'
import australiaStatesGeoJSON from './geojson/australian-states.json'

type AustraliaMapProps = {
  showPinLabel?: boolean
  pinSize?: number
  className?: string
  pins?: 'all' | PinName[]
  debug?: boolean
  children?: React.ReactNode
  mapClassName?: string
  pinClassName?: string
}

const defaultPinSize = 1

/**
 * Server-side rendered Australia map using d3-geo
 * Renders SVG map with city pins and labels
 */
export const AustraliaMap = React.forwardRef<HTMLDivElement, AustraliaMapProps>(
  (
    {
      showPinLabel = true,
      pinSize = defaultPinSize,
      className,
      pins = 'all',
      children,
      mapClassName = 'fill-[var(--brand-primary)] dark:fill-[var(--brand-primary)]',
      pinClassName = 'dark:fill-teal-700 fill-amber-200',
    }: AustraliaMapProps,
    ref,
  ) => {
    // Create projection that fits Australia
    const projection = d3.geoMercator().fitSize([SVG_WIDTH, SVG_HEIGHT], australiaGeoJSON as any)

    // Create path generator
    const path = d3.geoPath(projection)

    // Filter pins to show
    const pinsToShow = pinPositions.filter(
      (pin) => pins === 'all' || (Array.isArray(pins) && pins.includes(pin.name)),
    )

    // Convert pin positions to SVG coordinates
    const pinNodes = pinsToShow.map((pin) => {
      // d3-geo expects [longitude, latitude] format
      const coords: [number, number] = [pin.lng, pin.lat]
      const projected = projection(coords)
      return {
        name: pin.name,
        href: pin.href,
        x: projected ? projected[0] : 0,
        y: projected ? projected[1] : 0,
        labelOffsetX: pin?.labelOffsetX || 0,
      }
    })

    // Calculate pin radius based on pinSize prop (scaled to SVG)
    const pinRadius = (pinSize * SVG_WIDTH) / 100

    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        style={{
          width: '100%',
          aspectRatio: `${SVG_WIDTH} / ${SVG_HEIGHT}`,
          pointerEvents: 'none',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
        >
          {/* Transparent background layer */}
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="transparent" />

          {/* Australia outline */}
          <path
            d={path(australiaGeoJSON as any) || ''}
            fillOpacity="0.6"
            stroke="transparent"
            strokeWidth={0}
            className={mapClassName}
          />

          {/* State boundaries */}
          {australiaStatesGeoJSON.type === 'FeatureCollection' &&
            australiaStatesGeoJSON.features.map((feature: any, index: number) => (
              <path
                key={`state-${index}`}
                d={path(feature.geometry) || ''}
                fill="none"
                stroke="#000B58"
                strokeWidth={1}
                strokeOpacity={0.25}
              />
            ))}

          {/* City pins */}
          {pinNodes.map((pin, index) => (
            <g key={pin.name}>
              {/* Pin dot */}
              <circle
                cx={pin.x}
                cy={pin.y}
                r={pinRadius}
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={2}
                className={cn(
                  'animate-pulse dark:stroke-[var(--brand-primary)] stroke-[var(--brand-primary)]',
                  pinClassName,
                )}
              />

              {/* Pin label */}
              {showPinLabel && (
                <text
                  x={pin.x + pin.labelOffsetX}
                  y={pin.y - pinRadius - 10}
                  fill="currentColor"
                  textAnchor="middle"
                  className="text-black dark:text-white text-[27px] md:text-[20px] lg:text-[16px]"
                >
                  {pin.name}
                </text>
              )}
            </g>
          ))}
        </svg>

        {children && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            {children}
          </div>
        )}
      </div>
    )
  },
)

AustraliaMap.displayName = 'AustraliaMap'
