import React from 'react'
import type mapboxgl from 'mapbox-gl'
import universityGeoJSON from '../geojson/university.json'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { UNI_MARKER_COORDS } from '../constants'
import type { GeoJSONFeatureCollection } from '../types'
import { createMapMarker } from '../markerFactory'

type UniversityLayerProps = {
  map: mapboxgl.Map
}

export const addUniversityLayer = ({ map }: UniversityLayerProps) => {
  map.addSource('university-highlight', {
    type: 'geojson',
    data: universityGeoJSON as GeoJSONFeatureCollection,
  })

  map.addLayer({
    id: 'university-fill',
    type: 'fill',
    source: 'university-highlight',
    paint: {
      'fill-color': '#b669d6',
      'fill-opacity': 0.7,
    },
  })
}

export const addUniversityMarker = (map: mapboxgl.Map): mapboxgl.Marker | null => {
  return createMapMarker({
    coordinates: UNI_MARKER_COORDS,
    map,
    className: 'university-marker-label',
    anchor: 'bottom',
    component: (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="university-marker-wrapper"
            style={{
              position: 'relative',
              display: 'inline-block',
              cursor: 'pointer',
            }}
          >
            <img
              src="/logos/university-of-newcastle.svg"
              alt="University of Newcastle"
              style={{
                width: '40px',
                height: '40px',
                position: 'relative',
                zIndex: -10,
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent
          sideOffset={-20}
          avoidCollisions
          side="top"
          className="bg-background/60 backdrop-blur-sm text-foreground"
        >
          <div style={{ textAlign: 'center' }}>
            University of Newcastle
            <br />
            (Callaghan)
          </div>
        </TooltipContent>
      </Tooltip>
    ),
  })
}
