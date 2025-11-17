import { cn } from '@/utilities/ui'
import au from './au.svg'

const aspectRatio = {
  width: 1000,
  height: 966,
}

type PinName = 'Newcastle' | 'Cairns' | 'Launceston'

const pinPositions: {
  name: PinName
  coords: {
    x: number
    y: number
  }
  color: string
}[] = [
  {
    name: 'Newcastle',
    coords: {
      x: 910,
      y: 590,
    },
    color: 'red',
  },
  {
    name: 'Cairns',
    coords: {
      x: 760,
      y: 190,
    },
    color: 'green',
  },
  {
    name: 'Launceston',
    coords: {
      x: 790,
      y: 838,
    },
    color: 'blue',
  },
]
export const AustraliaMap = ({
  showPinLabel = true,
  width = '100%',
  className,
  pins = 'all',
}: {
  showPinLabel?: boolean
  width?: string
  className?: string
  // which pins to show, default is all
  pins?: 'all' | PinName[]
}) => {
  // Use the SVG as a CSS mask so we can control the fill via background color
  const src = (au as any)?.src || (au as unknown as string)

  return (
    <div className="relative">
      <div
        className={cn('bg-orange-200/60 dark:bg-red-500/60', className)}
        style={{
          // Fill color for the masked shape
          //   backgroundColor,
          // Maintain aspect ratio of the source (1000 x 966)
          width,
          height: '100%',
          aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}`,
          // Mask using the SVG so the background color shows through
          WebkitMaskImage: `url(${src})`,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          WebkitMaskPosition: 'center',
          maskImage: `url(${src})`,
          maskRepeat: 'no-repeat',
          maskSize: 'contain',
          maskPosition: 'center',
          // Ensure it doesn't intercept pointer events when used as background
          pointerEvents: 'none',
        }}
      />

      {pinPositions
        .filter((pin) => pins === 'all' || (Array.isArray(pins) && pins.includes(pin.name)))
        .map((pin) => (
          <span
            key={pin.name}
            style={{
              position: 'absolute',
              left: `${(pin.coords.x / aspectRatio.width) * 100}%`,
              top: `${(pin.coords.y / aspectRatio.height) * 100}%`,
            }}
          >
            <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-500/40 animate-ping"></span>
            <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-600 animate-pulse"></span>
            {showPinLabel && (
              <span className="absolute -top-5 left-2 -translate-x-1/2 text-xs">{pin.name}</span>
            )}
          </span>
        ))}
    </div>
  )
}
