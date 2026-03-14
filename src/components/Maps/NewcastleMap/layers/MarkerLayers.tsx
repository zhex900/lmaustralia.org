import React from 'react'
import type mapboxgl from 'mapbox-gl'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { HOME_MARKERS } from '../constants'
import { createMapMarker } from '../markerFactory'

type MarkerLayersProps = {
  map: mapboxgl.Map
  onRouteShow: (fromCoords: [number, number], label: string) => Promise<void>
  addressMarkersRef: React.RefObject<mapboxgl.Marker[]>
}

const addMarker = (
  coordinates: [number, number],
  label: string,
  map: mapboxgl.Map,
  onRouteShow: (fromCoords: [number, number], label: string) => Promise<void>,
  addressMarkersRef: React.RefObject<mapboxgl.Marker[]>,
) => {
  const [longitude, latitude] = coordinates

  const handleHomeClick = () => {
    onRouteShow([longitude, latitude], label)
  }

  createMapMarker({
    coordinates,
    map,
    component: (
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
      </Tooltip>
    ),
    onAdd: (marker) => {
      addressMarkersRef.current?.push(marker)
    },
  })

  return { longitude, latitude }
}

export const addMarkerLayers = ({ map, onRouteShow, addressMarkersRef }: MarkerLayersProps) => {
  for (const { coordinates, label } of HOME_MARKERS) {
    addMarker(coordinates, label, map, onRouteShow, addressMarkersRef)
  }
}
