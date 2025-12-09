import React from 'react'
import { createRoot } from 'react-dom/client'
import mapboxgl from 'mapbox-gl'
import { MarkerTooltip } from './MarkerTooltip'

type MarkerLayersProps = {
  map: mapboxgl.Map
  token: string
  onRouteShow: (fromCoords: [number, number], label: string) => Promise<void>
  addressMarkersRef: React.RefObject<mapboxgl.Marker[]>
}

export const markers = {
  'J & A': {
    address: '55 fussell street birmingham gardens',
    type: 'Home',
    anchor: {
      position: 'right',
      offset: {
        x: 0,
        y: 10,
      },
    },
  },
  'J & T': {
    address: '85 Main Rd Cardiff Heights NSW 2285',
    type: 'Home',
    anchor: {
      position: 'bottom-right',
      offset: {
        x: 0,
        y: 10,
      },
    },
  },
  'D & S': {
    address: '1/7 Verulam road, Lambton',
    type: 'Home',
    anchor: {
      position: 'left',
      offset: {
        x: 0,
        y: 10,
      },
    },
  },
  'D & M': {
    address: '48 Marsden Street, Shortland, NSW 2307',
    type: 'Home',
    anchor: {
      position: 'right',
      offset: {
        x: 0,
        y: 10,
      },
    },
  },
  // Add more addresses here as needed
}

// Function to geocode an address and add a home marker
const addMarker = async (
  addressToGeocode: string,
  label: string,
  map: mapboxgl.Map,
  token: string,
  onRouteShow: (fromCoords: [number, number], label: string) => Promise<void>,
  addressMarkersRef: React.RefObject<mapboxgl.Marker[]>,
) => {
  if (!addressToGeocode.trim()) return

  try {
    // Encode the address for URL
    const encodedAddress = encodeURIComponent(addressToGeocode)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${token}&limit=1`

    const response = await fetch(url)
    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center

      // Create custom marker element with icon
      const el = document.createElement('div')
      el.className = 'custom-marker'

      // Handler function for home click
      const handleHomeClick = () => {
        onRouteShow([longitude, latitude], label)
      }

      // Render JSX into the container with React event handlers
      const root = createRoot(el)
      root.render(
        <div
          className="custom-marker-wrapper"
          style={{
            position: 'relative',
            display: 'inline-block',
            cursor: 'pointer',
          }}
          onClick={handleHomeClick}
        >
          <div
            style={{
              fontSize: '24px',
              textAlign: 'center',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          >
            🏠
          </div>
          <MarkerTooltip wrapperClassName="custom-marker-wrapper" tooltipClassName="marker-tooltip">
            {label}
          </MarkerTooltip>
        </div>,
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

export const addMarkerLayers = async ({
  map,
  token,
  onRouteShow,
  addressMarkersRef,
}: MarkerLayersProps) => {
  // Add markers for home addresses
  for (const [label, { address }] of Object.entries(markers)) {
    await addMarker(address, label || '', map, token, onRouteShow, addressMarkersRef)
  }
}
