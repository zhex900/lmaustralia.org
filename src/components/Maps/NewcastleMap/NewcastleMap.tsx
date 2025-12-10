'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import { addAllLayers } from './layers'
import { useCatchmentHighlight } from './layers/catchment'
import { showRoute, clearRoute } from './routing'
import { LayerControls } from './LayerControls'
import {
  UNIVERSITY_COORDS,
  UNI_FRONT_GATE_COORDS,
  MIN_ZOOM,
  MAX_BOUNDS,
  NEWCASTLE_BOUNDS,
} from './constants'

const MAP_OPTIONS: Omit<mapboxgl.MapOptions, 'container'> = {
  style: 'mapbox://styles/mapbox/streets-v12',
  minZoom: MIN_ZOOM,
  maxBounds: MAX_BOUNDS,
  attributionControl: false,
  scrollZoom: true,
  doubleClickZoom: true,
  touchZoomRotate: true,
  boxZoom: false,
  dragRotate: false,
  dragPan: true,
  keyboard: false,
}

export const NewcastleMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const universityMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const addressMarkersRef = useRef<mapboxgl.Marker[]>([])
  const routeSourceRef = useRef<string | null>(null)
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  const activeRouteRef = useRef<string | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)

  const { highlightCatchment, unhighlightCatchment, highlightedCatchmentRef } =
    useCatchmentHighlight(mapRef)

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) return // Prevent double initialization

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      console.error('NEXT_PUBLIC_MAPBOX_TOKEN is not set')
      return
    }

    const showRouteToUniversity = async (fromCoords: [number, number], label: string) => {
      await showRoute({
        mapRef,
        routeSourceRef,
        popupRef,
        activeRouteRef,
        fromCoords,
        toCoords: UNI_FRONT_GATE_COORDS,
        label,
        token,
      })
    }

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const target = e.originalEvent?.target as HTMLElement
      if (target) {
        const isMarker = target.closest('.mapboxgl-marker') || target.closest('.custom-marker')
        const isPopup = target.closest('.mapboxgl-popup')

        if (target.classList.contains('mapboxgl-canvas') && !isMarker && !isPopup) {
          clearRoute({ mapRef, routeSourceRef, popupRef, activeRouteRef })
        }
      }
    }

    mapboxgl.accessToken = token

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        ...MAP_OPTIONS,
      })
    } catch (error) {
      setMapError(true)
      return
    }

    mapRef.current.on('click', handleMapClick)

    mapRef.current.on('load', async () => {
      if (!mapRef.current) return

      // Use Mapbox's native fitBounds for accurate initial view
      const padding = window.innerWidth < 640 ? 20 : window.innerWidth < 1024 ? 40 : 60

      mapRef.current.fitBounds(NEWCASTLE_BOUNDS, {
        padding: padding,
        duration: 0, // Instant on initial load
        maxZoom: 15, // Prevent zooming in too close
      })

      if (!universityMarkerRef.current) {
        universityMarkerRef.current = await addAllLayers({
          map: mapRef.current,
          token,
          universityCoords: UNIVERSITY_COORDS,
          onRouteShow: showRouteToUniversity,
          onCatchmentHighlight: highlightCatchment,
          onCatchmentUnhighlight: unhighlightCatchment,
          highlightedCatchmentRef,
          addressMarkersRef,
        })
      }

      setIsMapLoaded(true)
    })

    return () => {
      if (universityMarkerRef.current) {
        universityMarkerRef.current.remove()
        universityMarkerRef.current = null
      }

      if (addressMarkersRef.current.length > 0) {
        addressMarkersRef.current.forEach((marker) => marker.remove())
        addressMarkersRef.current = []
      }

      if (popupRef.current) {
        popupRef.current.remove()
        popupRef.current = null
      }

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      setIsMapLoaded(false)
    }
  }, [highlightCatchment, unhighlightCatchment, highlightedCatchmentRef])

  // Handle window resize to adjust map view
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return

    const handleResize = () => {
      if (!mapRef.current) return

      // Resize the map container
      mapRef.current.resize()

      // Optionally update view on resize using fitBounds
      const adjustViewOnResize = true

      if (adjustViewOnResize) {
        const padding = window.innerWidth < 640 ? 20 : window.innerWidth < 1024 ? 40 : 60

        mapRef.current.fitBounds(NEWCASTLE_BOUNDS, {
          padding: padding,
          duration: 1000, // Smooth transition
          maxZoom: 15, // Prevent zooming in too close
          essential: true,
        })
      }
    }

    // Debounce resize handler
    let resizeTimer: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleResize, 250)
    }

    window.addEventListener('resize', debouncedResize)

    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(resizeTimer)
    }
  }, [isMapLoaded])

  return (
    <div style={{ position: 'relative', height: '500px', width: '100%' }}>
      {mapError && process.env.NODE_ENV === 'development' && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <p className="text-sm text-muted-foreground">Map initialization error - refresh page</p>
        </div>
      )}
      <div
        ref={mapContainerRef}
        style={{ height: '100%', width: '100%' }}
        className="map-container rounded-lg"
      />
      {isMapLoaded && !mapError && (
        <LayerControls mapRef={mapRef} addressMarkersRef={addressMarkersRef} />
      )}
    </div>
  )
}
