'use client'

import React, { useState, useEffect } from 'react'

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
    <div className="absolute top-2.5 right-2.5 bg-white rounded p-2.5 shadow-md z-[1000]">
      <div className="font-bold mb-2 text-sm">Captions</div>

      <label className="flex items-center cursor-pointer mb-2 text-[13px]">
        <input
          type="checkbox"
          checked={showCampus}
          onChange={(e) => setShowCampus(e.target.checked)}
          className="mr-2 cursor-pointer"
        />
        <span>
          <span className="md:hidden">Campus</span>
          <span className="hidden md:inline">Closest to Campus</span>
        </span>
      </label>

      <label className="flex items-center cursor-pointer mb-2 text-[13px]">
        <input
          type="checkbox"
          checked={showSchoolZones}
          onChange={(e) => setShowSchoolZones(e.target.checked)}
          className="mr-2 cursor-pointer"
        />
        <span>
          <span className="md:hidden">Catchment</span>
          <span className="hidden md:inline">School Catchments</span>
        </span>
      </label>

      <label className="flex items-center cursor-pointer mb-2 text-[13px]">
        <input
          type="checkbox"
          checked={showHomes}
          onChange={(e) => setShowHomes(e.target.checked)}
          className="mr-2 cursor-pointer"
        />
        <span>
          <span className="md:hidden">Homes</span>
          <span className="hidden md:inline">Nearby Homes</span>
        </span>
      </label>

      <label className="flex items-center cursor-pointer text-[13px]">
        <input
          type="checkbox"
          checked={showNotInCatchment}
          onChange={(e) => setShowNotInCatchment(e.target.checked)}
          className="mr-2 cursor-pointer"
        />
        <span>
          <span className="md:hidden">Not in catchment</span>
          <span className="hidden md:inline">Not in School Catchment</span>
        </span>
      </label>
    </div>
  )
}
