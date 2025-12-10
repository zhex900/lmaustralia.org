import mapboxgl from 'mapbox-gl'
import zone1GeoJSON from '../geojson/zone-1.json'
import zone2GeoJSON from '../geojson/zone-2.json'

type ZonesLayerProps = {
  map: mapboxgl.Map
}

// zone 1 layer
export const zone1FillColor = '#f58282'
export const zone1OutlineColor = '#fa3c3c'

// zone 2 layer
export const zone2FillColor = '#f5b87a'
export const zone2OutlineColor = '#f57e05'

export const addZonesLayers = ({ map }: ZonesLayerProps) => {
  // Add GeoJSON source for zone-1
  map.addSource('zone-1', {
    type: 'geojson',
    data: zone1GeoJSON as any,
  })

  // Add fill layer for zone-1 (light red)
  map.addLayer({
    id: 'zone-1-fill',
    type: 'fill',
    source: 'zone-1',
    paint: {
      'fill-color': zone1FillColor, // Light red
      'fill-opacity': 0.4,
    },
  })

  // Add outline layer for zone-1
  map.addLayer({
    id: 'zone-1-outline',
    type: 'line',
    source: 'zone-1',
    paint: {
      'line-color': zone1OutlineColor, // Slightly darker red for outline
      'line-width': 2,
      'line-opacity': 0.7,
    },
  })

  // Add GeoJSON source for zone-2
  map.addSource('zone-2', {
    type: 'geojson',
    data: zone2GeoJSON as any,
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
