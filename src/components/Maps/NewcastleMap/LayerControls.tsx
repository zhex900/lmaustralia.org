'use client'

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import React, { useState, useEffect } from 'react'
import { defaultFillColor } from './layers/catchment/schools'
import { zone1FillColor, zone2FillColor } from './layers/ZonesLayer'

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

  const labelConfigs = [
    {
      color: zone1FillColor,
      id: 'campus',
      checked: showCampus,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setShowCampus(e.target.checked),
      label: ' ~4 km',
      tooltip: '5 min drive',
      mobileLabel: '~4 km, 5 min drive',
    },
    {
      color: defaultFillColor,
      id: 'schoolZones',
      checked: showSchoolZones,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setShowSchoolZones(e.target.checked),
      label: ' ~8 km',
      tooltip: 'Within school catchments',
      mobileLabel: '~8 km, within school catchments',
    },

    {
      color: zone2FillColor,
      id: 'notInCatchment',
      checked: showNotInCatchment,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setShowNotInCatchment(e.target.checked),
      label: '~10 km',
      tooltip: 'Outside school catchments',
      mobileLabel: '~10 km, outside school catchments',
    },
    {
      color: '',
      id: 'homes',
      checked: showHomes,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setShowHomes(e.target.checked),
      label: 'Homes',
      tooltip: 'Nearby homes',
      isLast: true,
      mobileLabel: 'Nearby homes',
    },
  ]

  return (
    <div className="relative md:static w-full md:w-auto">
      <div className="absolute p-2.5 top-2.5 w-full md:w-auto inset-x-0 md:inset-x-auto md:right-2.5 bg-background/60 backdrop-blur-sm rounded shadow-md z-[1000]">
        <div className="font-bold mb-2 text-sm">
          <span className="md:hidden">Proximity to campus</span>
          <span className="hidden md:inline">
            Proximity
            <br />
            to campus
          </span>
        </div>

        {labelConfigs.map((config) => {
          return (
            <Tooltip key={config.id}>
              <TooltipTrigger asChild>
                <label
                  className={`flex items-center justify-start md:justify-between cursor-pointer text-[13px] ${config.isLast ? '' : 'mb-2'}`}
                >
                  <input
                    type="checkbox"
                    checked={config.checked}
                    onChange={config.onChange}
                    className="mr-2 cursor-pointer"
                  />
                  <span>
                    <span className="hidden md:inline">{config.label}</span>
                    <span className="md:hidden">{config.mobileLabel}</span>
                  </span>
                  {/* put a colour box to show the colour of the layer */}
                  {config.color && (
                    <div
                      className="w-2 h-2 rounded-full ml-2"
                      style={{ backgroundColor: config.color }}
                    ></div>
                  )}
                  {config.id === 'homes' && <span className="ml-2">🏠</span>}
                </label>
              </TooltipTrigger>
              <TooltipContent side="right" className="hidden md:block">
                <p>{config.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
