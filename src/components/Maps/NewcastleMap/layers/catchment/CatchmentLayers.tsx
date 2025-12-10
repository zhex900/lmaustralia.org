import schoolCatchmentsData from '../../geojson/school-catchments.json'
import combinedCatchmentsData from '../../geojson/combined-school-catchments.json'
import { defaultFillColor, defaultOutlineColor, getSchoolColors } from './schools'
import type { GeoJSONFeatureCollection } from '../../types'
import type { Feature, GeoJsonProperties } from 'geojson'
import { toggleLayerVisibility } from '../../utils'

type SchoolFeature = Feature<any, GeoJsonProperties & { catchment?: string }>

type CatchmentLayersProps = {
  map: mapboxgl.Map
}

export const addCatchmentLayers = ({ map }: CatchmentLayersProps) => {
  map.addSource('combined-catchments', {
    type: 'geojson',
    data: combinedCatchmentsData as GeoJSONFeatureCollection,
  })

  map.addLayer({
    id: 'combined-catchments-fill',
    type: 'fill',
    source: 'combined-catchments',
    paint: {
      'fill-color': defaultFillColor,
      'fill-opacity': 0.3,
    },
  })

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

  if (Array.isArray(schoolCatchmentsData)) {
    (schoolCatchmentsData as SchoolFeature[]).forEach((feature) => {
      const catchmentId = feature.properties?.catchment || 'unknown'
      const sourceId = `catchment-${catchmentId}`
      const colors = getSchoolColors(catchmentId)

      const featureCollection: GeoJSONFeatureCollection = {
        type: 'FeatureCollection',
        features: [feature],
      }

      map.addSource(sourceId, {
        type: 'geojson',
        data: featureCollection,
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

export const showCatchmentLayer = (map: mapboxgl.Map, catchmentId: string) => {
  const sourceId = `catchment-${catchmentId}`

  toggleLayerVisibility(map, ['combined-catchments-fill', 'combined-catchments-outline'], false)
  toggleLayerVisibility(map, [`${sourceId}-fill`, `${sourceId}-outline`], true)
}

export const hideCatchmentLayer = (map: mapboxgl.Map) => {
  if (Array.isArray(schoolCatchmentsData)) {
    (schoolCatchmentsData as SchoolFeature[]).forEach((feature) => {
      const id = feature.properties?.catchment || 'unknown'
      const sourceId = `catchment-${id}`

      toggleLayerVisibility(map, [`${sourceId}-fill`, `${sourceId}-outline`], false)
    })
  }

  toggleLayerVisibility(map, ['combined-catchments-fill', 'combined-catchments-outline'], true)
}
