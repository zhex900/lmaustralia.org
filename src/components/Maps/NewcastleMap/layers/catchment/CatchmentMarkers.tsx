import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import mapboxgl from 'mapbox-gl'
import { SCHOOLS } from './schools'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

// Single component for catchment marker with hover state
const CatchmentMarker: React.FC<{
  logo?: string
  label: string
  catchment?: string
  onCatchmentHighlight: (sourceId: string) => void
  onCatchmentUnhighlight: () => void
  onCatchmentClick: () => void
  markerElement: HTMLElement
}> = ({
  logo,
  label,
  catchment,
  onCatchmentHighlight,
  onCatchmentUnhighlight,
  onCatchmentClick,
  markerElement,
}) => {
  const [isHovering, setIsHovering] = useState(false)

  // Update z-index on the marker element when hovering
  React.useEffect(() => {
    if (markerElement) {
      markerElement.style.zIndex = isHovering ? '20' : '1'
    }
  }, [isHovering, markerElement])

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (catchment) {
      const catchmentSourceId = `catchment-${catchment}`
      onCatchmentHighlight(catchmentSourceId)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (catchment) {
      onCatchmentUnhighlight()
    }
  }

  return (
    <Tooltip open={isHovering}>
      <TooltipTrigger asChild>
        <div
          className="custom-marker-wrapper"
          style={{
            position: 'relative',
            display: 'inline-block',
            cursor: 'pointer',
          }}
          onClick={onCatchmentClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
    // Encode the address for URL
    const encodedAddress = encodeURIComponent(addressToGeocode)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${token}&limit=1`

    const response = await fetch(url)
    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center

      // Create custom marker element
      const el = document.createElement('div')
      el.className = 'custom-marker'

      // Handler function for catchment click
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

      // Set initial z-index on marker element
      el.style.zIndex = '1'

      // Render component into the container
      const root = createRoot(el)
      root.render(
        <CatchmentMarker
          logo={logo}
          label={label}
          catchment={catchment}
          onCatchmentHighlight={onCatchmentHighlight}
          onCatchmentUnhighlight={onCatchmentUnhighlight}
          onCatchmentClick={handleCatchmentClick}
          markerElement={el}
        />,
      )

      // Add marker at the geocoded location
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([longitude, latitude])
        .addTo(map)

      addressMarkersRef.current?.push(marker)

      return { longitude, latitude }
    } else {
      console.error('No results found for address:', addressToGeocode)
      return null
    }
  } catch (error) {
    console.error('Error geocoding address:', error)
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
  // Add markers for catchment addresses
  for (const { address, label, catchment, logo } of SCHOOLS) {
    await addCatchmentMarker({
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
    })
  }
}
