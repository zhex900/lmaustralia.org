import React from 'react'
import mapboxgl from 'mapbox-gl'
import type { MapboxDirectionsResponse, RouteFeature } from './types'

type ShowRouteParams = {
  mapRef: React.RefObject<mapboxgl.Map | null>
  routeSourceRef: React.RefObject<string | null>
  popupRef: React.RefObject<mapboxgl.Popup | null>
  activeRouteRef: React.RefObject<string | null> // Track which marker's route is active
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
  routeSourceRef: React.RefObject<string | null>
  popupRef: React.RefObject<mapboxgl.Popup | null>
  activeRouteRef: React.RefObject<string | null>
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
    const data: MapboxDirectionsResponse = await response.json()

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0]
      const distance = (route.distance / 1000).toFixed(1)
      const duration = Math.round(route.duration / 60)

      const sourceId = `route-${Date.now()}`
      routeSourceRef.current = sourceId

      const routeFeature: RouteFeature = {
        type: 'Feature',
        geometry: route.geometry,
        properties: {},
      }

      mapRef.current.addSource(sourceId, {
        type: 'geojson',
        data: routeFeature,
      })

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

      const popup = new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat(fromCoords)
        .setHTML(
          `<div>
            <strong>${label}</strong><br/>
            <div>
              📍 To University of Newcastle<br/>
              🚗 Distance: ${distance} km<br/>
              ⏱️ Travel time: ${duration} min (driving)
            </div>
          </div>`,
        )
        .addTo(mapRef.current)

      popupRef.current = popup

      const setPopupZIndex = () => {
        const popupElement = popup.getElement()
        if (popupElement && popupElement.classList.contains('mapboxgl-popup')) {
          popupElement.style.zIndex = '9999'
          return
        }
        const mapContainer = mapRef.current?.getContainer()
        if (mapContainer) {
          const popupContainer = mapContainer.querySelector('.mapboxgl-popup') as HTMLElement
          if (popupContainer) {
            popupContainer.style.zIndex = '9999'
          }
        }
      }

      popup.on('open', () => {
        setTimeout(setPopupZIndex, 0)
      })

      setTimeout(setPopupZIndex, 0)

      popup.on('close', () => {
        clearRoute({ mapRef, routeSourceRef, popupRef, activeRouteRef, skipPopupRemove: true })
        popupRef.current = null
      })

      // Track this as the active route
      activeRouteRef.current = routeId
    }
  } catch (error) {
    console.error('Error getting route:', error)
  }
}
