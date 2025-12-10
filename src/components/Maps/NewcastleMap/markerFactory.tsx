import React from 'react'
import { createRoot } from 'react-dom/client'
import mapboxgl from 'mapbox-gl'

export interface CreateMarkerOptions {
  coordinates: [number, number]
  map: mapboxgl.Map
  component: React.ReactElement
  className?: string
  anchor?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  onAdd?: (marker: mapboxgl.Marker) => void
}

export const createMapMarker = ({
  coordinates,
  map,
  component,
  className = 'custom-marker',
  anchor = 'center',
  onAdd,
}: CreateMarkerOptions): mapboxgl.Marker => {
  const el = document.createElement('div')
  el.className = className

  const root = createRoot(el)
  root.render(component)

  const marker = new mapboxgl.Marker({
    element: el,
    anchor,
  })
    .setLngLat(coordinates)
    .addTo(map)

  onAdd?.(marker)

  return marker
}
