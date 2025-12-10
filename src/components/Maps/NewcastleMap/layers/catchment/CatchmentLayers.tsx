import schoolCatchmentsData from '../../geojson/school-catchments.json'
import combinedCatchmentsData from '../../geojson/combined-school-catchments.json'
import { defaultFillColor, defaultOutlineColor, getSchoolColors } from './schools'

type CatchmentLayersProps = {
  map: mapboxgl.Map
}

export const addCatchmentLayers = ({ map }: CatchmentLayersProps) => {
  // Add combined catchment layer (default, always visible)
  map.addSource('combined-catchments', {
    type: 'geojson',
    data: combinedCatchmentsData as any,
  })

  // Add fill layer for combined catchments
  map.addLayer({
    id: 'combined-catchments-fill',
    type: 'fill',
    source: 'combined-catchments',
    paint: {
      'fill-color': defaultFillColor,
      'fill-opacity': 0.3,
    },
  })

  // Add outline layer for combined catchments
  map.addLayer({
    id: 'combined-catchments-outline',
    type: 'line',
    source: 'combined-catchments',
    paint: {
      'line-color': defaultOutlineColor,
      'line-width': 1.5,
      'line-opacity': 0.6,
    },
  })

  // Add individual school catchment layers (hidden by default)
  if (Array.isArray(schoolCatchmentsData)) {
    schoolCatchmentsData.forEach((feature: any) => {
      const catchmentId = feature.properties?.catchment || 'unknown'
      const sourceId = `catchment-${catchmentId}`
      const colors = getSchoolColors(catchmentId)

      // Create FeatureCollection for this catchment
      const featureCollection = {
        type: 'FeatureCollection',
        features: [feature],
      }

      // Add source
      map.addSource(sourceId, {
        type: 'geojson',
        data: featureCollection as any,
      })

      // Add fill layer with school-specific color (hidden by default)
      map.addLayer({
        id: `${sourceId}-fill`,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': colors?.fillColor || defaultFillColor,
          'fill-opacity': 0.6,
        },
        layout: {
          visibility: 'none', // Hidden by default
        },
      })

      // Add outline layer with school-specific color (hidden by default)
      map.addLayer({
        id: `${sourceId}-outline`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': colors?.outlineColor || defaultOutlineColor,
          'line-width': 2.5,
          'line-opacity': 1,
        },
        layout: {
          visibility: 'none', // Hidden by default
        },
      })
    })
  }
}

// Function to show an individual catchment layer
export const showCatchmentLayer = (map: mapboxgl.Map, catchmentId: string) => {
  const sourceId = `catchment-${catchmentId}`

  // Hide combined layer
  if (map.getLayer('combined-catchments-fill')) {
    map.setLayoutProperty('combined-catchments-fill', 'visibility', 'none')
  }
  if (map.getLayer('combined-catchments-outline')) {
    map.setLayoutProperty('combined-catchments-outline', 'visibility', 'none')
  }

  // Show individual catchment layer
  if (map.getLayer(`${sourceId}-fill`)) {
    map.setLayoutProperty(`${sourceId}-fill`, 'visibility', 'visible')
  }
  if (map.getLayer(`${sourceId}-outline`)) {
    map.setLayoutProperty(`${sourceId}-outline`, 'visibility', 'visible')
  }
}

// Function to hide individual catchment and show combined layer
export const hideCatchmentLayer = (map: mapboxgl.Map) => {
  // Hide all individual catchment layers
  if (Array.isArray(schoolCatchmentsData)) {
    schoolCatchmentsData.forEach((feature: any) => {
      const id = feature.properties?.catchment || 'unknown'
      const sourceId = `catchment-${id}`

      if (map.getLayer(`${sourceId}-fill`)) {
        map.setLayoutProperty(`${sourceId}-fill`, 'visibility', 'none')
      }
      if (map.getLayer(`${sourceId}-outline`)) {
        map.setLayoutProperty(`${sourceId}-outline`, 'visibility', 'none')
      }
    })
  }

  // Show combined layer
  if (map.getLayer('combined-catchments-fill')) {
    map.setLayoutProperty('combined-catchments-fill', 'visibility', 'visible')
  }
  if (map.getLayer('combined-catchments-outline')) {
    map.setLayoutProperty('combined-catchments-outline', 'visibility', 'visible')
  }
}
