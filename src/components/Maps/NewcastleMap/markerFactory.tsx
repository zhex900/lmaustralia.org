import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import mapboxgl from 'mapbox-gl'

export interface CreateMarkerOptions {
  coordinates: [number, number]
  map: mapboxgl.Map
  component: React.ReactElement
  className?: string
  anchor?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  onAdd?: (marker: mapboxgl.Marker) => void
}

// Store roots to enable cleanup
const markerRoots = new WeakMap<mapboxgl.Marker, Root>()

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

  // Store root for cleanup
  markerRoots.set(marker, root)

  onAdd?.(marker)

  return marker
}

// Cleanup function to unmount React root when marker is removed
export const cleanupMarker = (marker: mapboxgl.Marker) => {
  const root = markerRoots.get(marker)
  if (root) {
    root.unmount()
    markerRoots.delete(marker)
  }
  marker.remove()
}
