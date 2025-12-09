import React from 'react'
import mapboxgl from 'mapbox-gl'
import { markers } from './layers/MarkerLayers'

type ShowRouteParams = {
  mapRef: React.RefObject<mapboxgl.Map | null>
  routeSourceRef: React.MutableRefObject<string | null>
  popupRef: React.MutableRefObject<mapboxgl.Popup | null>
  activeRouteRef: React.MutableRefObject<string | null> // Track which marker's route is active
  fromCoords: [number, number]
  toCoords: [number, number]
  label: string
  token: string
}

// Function to clear route and popup
export const clearRoute = ({
  mapRef,
  routeSourceRef,
  popupRef,
  activeRouteRef,
  skipPopupRemove = false,
}: {
  mapRef: React.RefObject<mapboxgl.Map | null>
  routeSourceRef: React.MutableRefObject<string | null>
  popupRef: React.MutableRefObject<mapboxgl.Popup | null>
  activeRouteRef: React.MutableRefObject<string | null>
  skipPopupRemove?: boolean
}) => {
  if (!mapRef.current) return

  // Remove route layer and source
  if (routeSourceRef.current && mapRef.current.getSource(routeSourceRef.current)) {
    if (mapRef.current.getLayer('route-line')) {
      mapRef.current.removeLayer('route-line')
    }
    mapRef.current.removeSource(routeSourceRef.current)
    routeSourceRef.current = null
  }

  // Close popup (skip if called from popup close event to avoid infinite loop)
  if (!skipPopupRemove && popupRef.current) {
    popupRef.current.remove()
    popupRef.current = null
  }

  // Clear active route marker
  activeRouteRef.current = null
}

export const showRoute = async ({
  mapRef,
  routeSourceRef,
  popupRef,
  activeRouteRef,
  fromCoords,
  toCoords,
  label,
  token,
}: ShowRouteParams) => {
  if (!mapRef.current) return
  console.log('label', label)
  // Create a unique identifier for this route (using label + coordinates)
  const routeId = `${label}-${fromCoords[0]}-${fromCoords[1]}`

  // If clicking the same marker, toggle off (clear route)
  if (activeRouteRef.current === routeId) {
    clearRoute({ mapRef, routeSourceRef, popupRef, activeRouteRef })
    return
  }

  try {
    // Remove previous route if exists
    if (routeSourceRef.current && mapRef.current.getSource(routeSourceRef.current)) {
      if (mapRef.current.getLayer('route-line')) {
        mapRef.current.removeLayer('route-line')
      }
      mapRef.current.removeSource(routeSourceRef.current)
    }

    // Close previous popup if exists
    if (popupRef.current) {
      popupRef.current.remove()
    }

    // Get directions from Mapbox Directions API
    const coordinates = `${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}`
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?access_token=${token}&geometries=geojson&overview=full`

    const response = await fetch(url)
    const data = await response.json()

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0]
      const distance = (route.distance / 1000).toFixed(1) // Convert to km
      const duration = Math.round(route.duration / 60) // Convert to minutes

      // Add route source
      const sourceId = `route-${Date.now()}`
      routeSourceRef.current = sourceId

      mapRef.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: route.geometry,
          properties: {},
        } as any,
      })

      // Add route layer
      mapRef.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#007bff',
          'line-width': 4,
          'line-opacity': 0.75,
        },
      })

      const markerConfig = markers[label as keyof typeof markers]
      const xOffset = markerConfig?.anchor?.offset?.x ?? 0
      const yOffset = markerConfig?.anchor?.offset?.y ?? 0
      const anchor = (markerConfig?.anchor?.position as mapboxgl.PopupOptions['anchor']) ?? 'bottom'
      console.log('anchor', markerConfig, anchor)
      // Show popup with distance and travel time
      // const anchor = markers[label].anchor.position
      const popup = new mapboxgl.Popup({ closeOnClick: true, anchor })
        .setLngLat(fromCoords)
        .setHTML(
          `<div style="padding: 1px; z-index: 3;">
            <strong>${label}</strong><br/>
            <div style="margin-top: 4px;">
              📍 To University of Newcastle<br/>
              🚗 Distance: ${distance} km<br/>
              ⏱️ Travel time: ${duration} min (driving)
            </div>
          </div>`,
        )
        .addTo(mapRef.current)

      popupRef.current = popup

      // Set high z-index on popup container to appear above markers
      const setPopupZIndex = () => {
        // Try getting element from popup object first
        const popupElement = popup.getElement()
        if (popupElement && popupElement.classList.contains('mapboxgl-popup')) {
          popupElement.style.zIndex = '9999'
          return
        }
        // // Fallback: query DOM directly for the popup container
        const mapContainer = mapRef.current?.getContainer()
        if (mapContainer) {
          const popupContainer = mapContainer.querySelector('.mapboxgl-popup') as HTMLElement
          if (popupContainer) {
            popupContainer.style.zIndex = '9999'
          }
        }
      }

      // Set z-index when popup opens
      popup.on('open', () => {
        setTimeout(setPopupZIndex, 0)
      })

      // // Also try immediately after adding (in case open event already fired)
      setTimeout(setPopupZIndex, 0)

      // Clear route when popup is closed (skip popup remove to avoid infinite loop)
      popup.on('close', () => {
        clearRoute({ mapRef, routeSourceRef, popupRef, activeRouteRef, skipPopupRemove: true })
        // Clear popup ref since it's already being removed
        popupRef.current = null
      })

      // Track this as the active route
      activeRouteRef.current = routeId
    }
  } catch (error) {
    console.error('Error getting route:', error)
  }
}
