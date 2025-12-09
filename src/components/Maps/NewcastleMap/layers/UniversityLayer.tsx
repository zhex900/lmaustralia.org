import React from 'react'
import { createRoot } from 'react-dom/client'
import mapboxgl from 'mapbox-gl'
import universityGeoJSON from '../geojson/university.json'
import { MarkerTooltip } from './MarkerTooltip'

type UniversityLayerProps = {
  map: mapboxgl.Map
}

export const addUniversityLayer = ({ map }: UniversityLayerProps) => {
  // Add GeoJSON source for university highlight
  map.addSource('university-highlight', {
    type: 'geojson',
    data: universityGeoJSON as any,
  })

  // Add fill layer
  map.addLayer({
    id: 'university-fill',
    type: 'fill',
    source: 'university-highlight',
    paint: {
      'fill-color': '#b669d6',
      'fill-opacity': 0.2,
    },
  })

  // Add outline layer
  map.addLayer({
    id: 'university-outline',
    type: 'line',
    source: 'university-highlight',
    paint: {
      'line-color': '#9909d6',
      'line-width': 2,
      'line-opacity': 0.6,
    },
  })
}

export const addUniversityMarker = (map: mapboxgl.Map): mapboxgl.Marker | null => {
  // Create container element for JSX
  const el = document.createElement('div')
  el.className = 'university-marker-label'

  // Render JSX into the container
  const root = createRoot(el)
  root.render(
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
          width: '60px',
          height: '60px',
          position: 'relative',
          zIndex: -10,
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}
      />
      <MarkerTooltip
        wrapperClassName="university-marker-wrapper"
        tooltipClassName="university-tooltip"
      >
        <div style={{ textAlign: 'center' }}>
          University of Newcastle
          <br />
          (Callaghan)
        </div>
      </MarkerTooltip>
    </div>,
  )

  const marker = new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat([151.70515330047283, -32.891143664377395])
    .addTo(map)

  return marker
}
