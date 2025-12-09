import mapboxgl from 'mapbox-gl'
import zone1GeoJSON from '../geojson/zone-1.json'
import zone2GeoJSON from '../geojson/zone-2.json'

type ZonesLayerProps = {
  map: mapboxgl.Map
}

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
      'fill-color': '#ffbdbd', // Light red
      'fill-opacity': 0.4,
    },
  })

  // Add outline layer for zone-1
  map.addLayer({
    id: 'zone-1-outline',
    type: 'line',
    source: 'zone-1',
    paint: {
      'line-color': '#fa3c3c', // Slightly darker red for outline
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
      'fill-color': '#67c6e6', // Light blue
      'fill-opacity': 0.4,
    },
  })

  // Add outline layer for zone-2
  map.addLayer({
    id: 'zone-2-outline',
    type: 'line',
    source: 'zone-2',
    paint: {
      'line-color': '#00a1d6', // Slightly darker blue for outline
      'line-width': 2,
      'line-opacity': 0.7,
    },
  })
}
