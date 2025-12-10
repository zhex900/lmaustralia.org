import React from 'react'
import { createRoot } from 'react-dom/client'
import mapboxgl from 'mapbox-gl'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

type MarkerLayersProps = {
  map: mapboxgl.Map
  onRouteShow: (fromCoords: [number, number], label: string) => Promise<void>
  addressMarkersRef: React.RefObject<mapboxgl.Marker[]>
}

export const markers = [
  {
    label: 'J & A',
    coordinates: [151.68806500859893, -32.894431382496684] as [number, number],
  },
  {
    coordinates: [151.67687409325748, -32.9359213992419] as [number, number],
    label: 'J & T',
  },
  {
    coordinates: [151.71606477049914, -32.9114411278816] as [number, number],
    label: 'D & S',
  },
  {
    coordinates: [151.690008262567, -32.87665511446352] as [number, number],
    label: 'D & M',
  },
  // Add more coordinates here as needed
]

// Function to add a home marker at specified coordinates
const addMarker = (
  coordinates: [number, number],
  label: string,
  map: mapboxgl.Map,
  onRouteShow: (fromCoords: [number, number], label: string) => Promise<void>,
  addressMarkersRef: React.RefObject<mapboxgl.Marker[]>,
) => {
  const [longitude, latitude] = coordinates

  // Create custom marker element with icon
  const el = document.createElement('div')
  el.className = 'custom-marker'

  // Handler function for home click
  const handleHomeClick = () => {
    onRouteShow([longitude, latitude], label)
  }

  // Render JSX into the container with React event handlers
  const root = createRoot(el)
  root.render(
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="custom-marker-wrapper"
          style={{
            position: 'relative',
            display: 'inline-block',
            cursor: 'pointer',
          }}
          onClick={handleHomeClick}
        >
          <div
            style={{
              fontSize: '24px',
              textAlign: 'center',
              filter: 'drop-shadow(0 2px 4px var(--foreground))',
            }}
          >
            🏠
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        avoidCollisions
        side="top"
        sideOffset={10}
        className="bg-background/60 backdrop-blur-sm text-foreground"
      >
        {label}
      </TooltipContent>
    </Tooltip>,
  )

  // Add marker at the specified location
  const marker = new mapboxgl.Marker({
    element: el,
    anchor: 'center',
  })
    .setLngLat([longitude, latitude])
    .addTo(map)

  addressMarkersRef.current?.push(marker)

  return { longitude, latitude }
}

export const addMarkerLayers = ({ map, onRouteShow, addressMarkersRef }: MarkerLayersProps) => {
  // Add markers for home coordinates
  for (const { coordinates, label } of markers) {
    addMarker(coordinates, label, map, onRouteShow, addressMarkersRef)
  }
}
