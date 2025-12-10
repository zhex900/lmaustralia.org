import React from 'react'
import { SCHOOLS } from './schools'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import type { MapboxGeocodingResponse } from '../../types'
import { createMapMarker } from '../../markerFactory'

// Single component for catchment marker with hover state
const CatchmentMarker: React.FC<{
  logo?: string
  label: string
  onCatchmentClick: () => void
}> = ({ logo, label, onCatchmentClick }) => {
  const [tooltipOpen, setTooltipOpen] = React.useState(false)

  const handleClick = () => {
    setTooltipOpen(!tooltipOpen)
    onCatchmentClick()
    //auto close the tooltip after 1.5 seconds

    setTimeout(() => {
      setTooltipOpen(false)
    }, 1500)
  }
  return (
    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
      <TooltipTrigger asChild>
        <div
          className="custom-marker-wrapper"
          style={{
            position: 'relative',
            display: 'inline-block',
            cursor: 'pointer',
          }}
          onClick={handleClick}
        >
          {logo && (
            <img
              src={logo}
              alt={label}
              style={{
                width: '30px',
                height: '30px',
                position: 'relative',
                zIndex: -10,
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent
        sideOffset={-20}
        avoidCollisions
        side="top"
        className="bg-background/60 backdrop-blur-sm text-foreground"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

type CatchmentMarkersProps = {
  map: mapboxgl.Map
  token: string
  onCatchmentHighlight: (sourceId: string) => void
  onCatchmentUnhighlight: () => void
  highlightedCatchmentRef: React.RefObject<string | null>
  addressMarkersRef: React.RefObject<mapboxgl.Marker[]>
}

type AddCatchmentMarkerParams = {
  addressToGeocode: string
  label: string
  catchment?: string
  logo?: string
  map: mapboxgl.Map
  token: string
  onCatchmentHighlight: (sourceId: string) => void
  onCatchmentUnhighlight: () => void
  highlightedCatchmentRef: React.RefObject<string | null>
  addressMarkersRef: React.RefObject<mapboxgl.Marker[]>
}

// Function to geocode an address and add a catchment marker
const addCatchmentMarker = async ({
  addressToGeocode,
  label,
  catchment,
  logo,
  map,
  token,
  onCatchmentHighlight,
  onCatchmentUnhighlight,
  highlightedCatchmentRef,
  addressMarkersRef,
}: AddCatchmentMarkerParams) => {
  if (!addressToGeocode.trim()) return

  try {
    const encodedAddress = encodeURIComponent(addressToGeocode)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${token}&limit=1`

    const response = await fetch(url)
    const data: MapboxGeocodingResponse = await response.json()

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center

      const handleCatchmentClick = () => {
        if (!catchment) {
          return
        }
        const catchmentSourceId = `catchment-${catchment}`
        if (highlightedCatchmentRef.current === catchmentSourceId) {
          onCatchmentUnhighlight()
        } else {
          onCatchmentHighlight(catchmentSourceId)
        }
      }

      createMapMarker({
        coordinates: [longitude, latitude],
        map,
        component: (
          <CatchmentMarker logo={logo} label={label} onCatchmentClick={handleCatchmentClick} />
        ),
        onAdd: (marker) => {
          const el = marker.getElement()
          el.style.zIndex = '1'
          addressMarkersRef.current?.push(marker)
        },
      })

      return { longitude, latitude }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.error('No results found for address:', addressToGeocode)
      }
      return null
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error geocoding address:', error)
    }
    return null
  }
}

export const addCatchmentMarkers = async ({
  map,
  token,
  onCatchmentHighlight,
  onCatchmentUnhighlight,
  highlightedCatchmentRef,
  addressMarkersRef,
}: CatchmentMarkersProps) => {
  const markerPromises = SCHOOLS.map(({ address, label, catchment, logo }) =>
    addCatchmentMarker({
      addressToGeocode: address,
      label: label || '',
      catchment,
      logo,
      map,
      token,
      onCatchmentHighlight,
      onCatchmentUnhighlight,
      highlightedCatchmentRef,
      addressMarkersRef,
    }),
  )

  await Promise.all(markerPromises)
}
