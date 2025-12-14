'use client'

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import React, { useState, useEffect } from 'react'
import type mapboxgl from 'mapbox-gl'
import { defaultFillColor } from './layers/catchment/schools'
import { zone1FillColor, zone2FillColor } from './layers/ZonesLayer'
import { toggleLayerVisibility, toggleMarkersVisibility } from './utils'

type LayerControlsProps = {
  mapRef: React.RefObject<mapboxgl.Map | null>
  addressMarkersRef: React.RefObject<mapboxgl.Marker[]>
}

export const LayerControls: React.FC<LayerControlsProps> = ({ mapRef, addressMarkersRef }) => {
  const [showCampus, setShowCampus] = useState(true)
  const [showSchoolZones, setShowSchoolZones] = useState(true)
  const [showHomes, setShowHomes] = useState(false)
  const [showNotInCatchment, setShowNotInCatchment] = useState(true)

  useEffect(() => {
    toggleLayerVisibility(mapRef.current, ['zone-1-fill', 'zone-1-outline'], showCampus)
  }, [showCampus])

  useEffect(() => {
    toggleLayerVisibility(mapRef.current, ['zone-2-fill', 'zone-2-outline'], showNotInCatchment)
  }, [showNotInCatchment])

  useEffect(() => {
    toggleLayerVisibility(
      mapRef.current,
      ['combined-catchments-fill', 'combined-catchments-outline'],
      showSchoolZones,
    )

    if (addressMarkersRef.current) {
      toggleMarkersVisibility(addressMarkersRef.current, showSchoolZones, (element) =>
        Boolean(element.querySelector('.custom-marker-wrapper img')),
      )
    }
  }, [showSchoolZones])

  useEffect(() => {
    if (!addressMarkersRef.current) return

    toggleMarkersVisibility(
      addressMarkersRef.current,
      showHomes,
      (element) => !element.querySelector('.custom-marker-wrapper img'),
    )
  }, [showHomes])

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

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
  }

  return (
    <div className="relative mt-2 md:static w-full md:w-auto">
      <div className="relative md:absolute p-2.5 md:top-2.5 w-full md:w-auto md:right-2.5 bg-background/60 backdrop-blur-sm rounded shadow-md z-[1000]">
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
              <TooltipContent side="right" sideOffset={15} className="hidden md:block">
                <p>{config.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-2.5 right-2.5 flex flex-col gap-1 z-[1000]">
        <button
          onClick={handleZoomIn}
          className="w-5 h-5 bg-background/60 backdrop-blur-sm rounded shadow-md flex items-center justify-center text-lg font-semibold hover:bg-background/80 transition-colors"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-5 h-5 bg-background/60 backdrop-blur-sm rounded shadow-md flex items-center justify-center text-lg font-semibold hover:bg-background/80 transition-colors"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  )
}
