import React from 'react'
import mapboxgl from 'mapbox-gl'
import { addCatchmentLayers, addCatchmentMarkers } from './catchment'
import { addUniversityLayer, addUniversityMarker } from './UniversityLayer'
import { addZonesLayers } from './ZonesLayer'
import { addMarkerLayers } from './MarkerLayers'

type Address = {
  label: string
  address: string
  type: string
  catchment?: string
}

type LayersProps = {
  map: mapboxgl.Map
  token: string
  universityCoords: [number, number]
  onRouteShow: (fromCoords: [number, number], label: string) => Promise<void>
  onCatchmentHighlight: (sourceId: string) => void
  onCatchmentUnhighlight: () => void
  highlightedCatchmentRef: React.RefObject<string | null>
  addressMarkersRef: React.MutableRefObject<mapboxgl.Marker[]>
}

export const addAllLayers = async ({
  map,
  token,
  onRouteShow,
  onCatchmentHighlight,
  onCatchmentUnhighlight,
  highlightedCatchmentRef,
  addressMarkersRef,
}: LayersProps) => {
  // Add university layer and marker
  addUniversityLayer({ map })
  const universityMarker = addUniversityMarker(map)

  // Add zones layers
  addZonesLayers({ map })

  // Add catchment layers
  addCatchmentLayers({ map })

  // Add catchment markers (schools)
  await addCatchmentMarkers({
    map,
    token,
    onCatchmentHighlight,
    onCatchmentUnhighlight,
    highlightedCatchmentRef,
    addressMarkersRef,
  })

  // Add home markers
  addMarkerLayers({
    map,
    onRouteShow,
    addressMarkersRef,
  })

  return universityMarker
}
