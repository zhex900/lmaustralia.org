import zone1GeoJSON from '../geojson/zone-1.json'
import zone2GeoJSON from '../geojson/zone-2.json'
import type { GeoJSONFeatureCollection } from '../types'

type ZonesLayerProps = {
  map: mapboxgl.Map
}

export const zone1FillColor = '#f58282'
export const zone1OutlineColor = '#fa3c3c'

export const zone2FillColor = '#f5b87a'
export const zone2OutlineColor = '#f57e05'

export const addZonesLayers = ({ map }: ZonesLayerProps) => {
  map.addSource('zone-1', {
    type: 'geojson',
    data: zone1GeoJSON as GeoJSONFeatureCollection,
  })

  map.addLayer({
    id: 'zone-1-fill',
    type: 'fill',
    source: 'zone-1',
    paint: {
      'fill-color': zone1FillColor,
      'fill-opacity': 0.4,
    },
  })

  map.addLayer({
    id: 'zone-1-outline',
    type: 'line',
    source: 'zone-1',
    paint: {
      'line-color': zone1OutlineColor,
      'line-width': 2,
      'line-opacity': 0.7,
    },
  })

  map.addSource('zone-2', {
    type: 'geojson',
    data: zone2GeoJSON as GeoJSONFeatureCollection,
  })

  // Add fill layer for zone-2 (light blue)
  map.addLayer({
    id: 'zone-2-fill',
    type: 'fill',
    source: 'zone-2',
    paint: {
      'fill-color': zone2FillColor, // Light orange
      'fill-opacity': 0.4,
    },
  })

  // Add outline layer for zone-2
  map.addLayer({
    id: 'zone-2-outline',
    type: 'line',
    source: 'zone-2',
    paint: {
      'line-color': zone2OutlineColor, // Slightly darker orange for outline
      'line-width': 2,
      'line-opacity': 0.7,
    },
  })
}
