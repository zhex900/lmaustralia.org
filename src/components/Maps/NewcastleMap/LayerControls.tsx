'use client'

import React, { useState, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

type LayerControlsProps = {
  mapRef: React.RefObject<mapboxgl.Map | null>
  addressMarkersRef: React.RefObject<mapboxgl.Marker[]>
}

export const LayerControls: React.FC<LayerControlsProps> = ({ mapRef, addressMarkersRef }) => {
  const [showCampus, setShowCampus] = useState(true)
  const [showSchoolZones, setShowSchoolZones] = useState(true)
  const [showHomes, setShowHomes] = useState(true)
  const [showNotInCatchment, setShowNotInCatchment] = useState(true)

  // Toggle zone 1 layers only
  useEffect(() => {
    if (!mapRef.current) return

    const visibility = showCampus ? 'visible' : 'none'

    // Toggle zone 1 layers
    if (mapRef.current.getLayer('zone-1-fill')) {
      mapRef.current.setLayoutProperty('zone-1-fill', 'visibility', visibility)
    }
    if (mapRef.current.getLayer('zone-1-outline')) {
      mapRef.current.setLayoutProperty('zone-1-outline', 'visibility', visibility)
    }
  }, [showCampus, mapRef])

  // Toggle zone 2 layers (Not in school catchment)
  useEffect(() => {
    if (!mapRef.current) return

    const visibility = showNotInCatchment ? 'visible' : 'none'

    // Toggle zone 2 layers
    if (mapRef.current.getLayer('zone-2-fill')) {
      mapRef.current.setLayoutProperty('zone-2-fill', 'visibility', visibility)
    }
    if (mapRef.current.getLayer('zone-2-outline')) {
      mapRef.current.setLayoutProperty('zone-2-outline', 'visibility', visibility)
    }
  }, [showNotInCatchment, mapRef])

  // Toggle school zones (catchment layers)
  useEffect(() => {
    if (!mapRef.current) return

    const visibility = showSchoolZones ? 'visible' : 'none'

    // Toggle combined catchments
    if (mapRef.current.getLayer('combined-catchments-fill')) {
      mapRef.current.setLayoutProperty('combined-catchments-fill', 'visibility', visibility)
    }
    if (mapRef.current.getLayer('combined-catchments-outline')) {
      mapRef.current.setLayoutProperty('combined-catchments-outline', 'visibility', visibility)
    }

    // Toggle school markers (catchment markers) - they're also in addressMarkersRef
    // We'll filter them by checking if they have an img element (logo)
    if (addressMarkersRef.current) {
      addressMarkersRef.current.forEach((marker) => {
        const element = marker.getElement()
        if (element) {
          // Check if this is a school marker (has custom-marker-wrapper with logo img)
          const isSchoolMarker = element.querySelector('.custom-marker-wrapper img')
          if (isSchoolMarker) {
            element.style.display = showSchoolZones ? 'block' : 'none'
          }
        }
      })
    }
  }, [showSchoolZones, mapRef, addressMarkersRef])

  // Toggle home markers (distinguish from school markers by checking for emoji, not img)
  useEffect(() => {
    if (!addressMarkersRef.current) return

    addressMarkersRef.current.forEach((marker) => {
      const element = marker.getElement()
      if (element) {
        // Check if this is a home marker (has emoji, not an img logo)
        const isSchoolMarker = element.querySelector('.custom-marker-wrapper img')
        if (!isSchoolMarker) {
          // This is a home marker (has emoji icon)
          element.style.display = showHomes ? 'block' : 'none'
        }
      }
    })
  }, [showHomes, addressMarkersRef])

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 1000,
        minWidth: '200px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Captions</div>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: '8px',
          fontSize: '13px',
        }}
      >
        <input
          type="checkbox"
          checked={showCampus}
          onChange={(e) => setShowCampus(e.target.checked)}
          style={{ marginRight: '8px', cursor: 'pointer' }}
        />
        <span>1. Closest to Campus</span>
      </label>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: '8px',
          fontSize: '13px',
        }}
      >
        <input
          type="checkbox"
          checked={showSchoolZones}
          onChange={(e) => setShowSchoolZones(e.target.checked)}
          style={{ marginRight: '8px', cursor: 'pointer' }}
        />
        <span>2. School Catchments</span>
      </label>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: '8px',
          fontSize: '13px',
        }}
      >
        <input
          type="checkbox"
          checked={showHomes}
          onChange={(e) => setShowHomes(e.target.checked)}
          style={{ marginRight: '8px', cursor: 'pointer' }}
        />
        <span>3. Nearby Homes</span>
      </label>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '13px',
        }}
      >
        <input
          type="checkbox"
          checked={showNotInCatchment}
          onChange={(e) => setShowNotInCatchment(e.target.checked)}
          style={{ marginRight: '8px', cursor: 'pointer' }}
        />
        <span>4. Not in School Catchment</span>
      </label>
    </div>
  )
}
