'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { cleanupMarker } from './markerFactory'

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
  MAX_ZOOM,
  FIT_BOUNDS_DURATION_INITIAL,
  FIT_BOUNDS_DURATION_RESIZE,
  MOBILE_BREAKPOINT,
  TABLET_BREAKPOINT,
  PADDING_MOBILE,
  PADDING_TABLET,
  PADDING_DESKTOP,
  DEBOUNCE_DELAY,
} from './constants'

const MAP_OPTIONS: Omit<mapboxgl.MapOptions, 'container'> = {
  style: 'mapbox://styles/mapbox/streets-v12',
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  maxBounds: MAX_BOUNDS,
  attributionControl: false,
  scrollZoom: false,
  doubleClickZoom: true,
  touchZoomRotate: true,
  boxZoom: false,
  dragRotate: false,
  dragPan: true,
  keyboard: false,
}

// Helper to calculate responsive padding
const getResponsivePadding = () => {
  if (typeof window === 'undefined') return PADDING_TABLET
  const width = window.innerWidth
  return width < MOBILE_BREAKPOINT
    ? PADDING_MOBILE
    : width < TABLET_BREAKPOINT
      ? PADDING_TABLET
      : PADDING_DESKTOP
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

  // Main map initialization effect
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        console.error('NEXT_PUBLIC_MAPBOX_TOKEN is not set')
      }
      setMapError(true)
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
      if (!target) return

      const isMarker = target.closest('.mapboxgl-marker') || target.closest('.custom-marker')
      const isPopup = target.closest('.mapboxgl-popup')

      if (target.classList.contains('mapboxgl-canvas') && !isMarker && !isPopup) {
        clearRoute({ mapRef, routeSourceRef, popupRef, activeRouteRef })
      }
    }

    mapboxgl.accessToken = token

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        ...MAP_OPTIONS,
      })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to initialize map:', error)
      }
      setMapError(true)
      return
    }

    mapRef.current.on('click', handleMapClick)

    mapRef.current.on('load', async () => {
      if (!mapRef.current) return

      // Fit bounds to Newcastle area with responsive padding
      mapRef.current.fitBounds(NEWCASTLE_BOUNDS, {
        padding: getResponsivePadding(),
        duration: FIT_BOUNDS_DURATION_INITIAL,
        maxZoom: MAX_ZOOM,
      })

      // Add all map layers and markers
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

    // Cleanup function
    return () => {
      if (universityMarkerRef.current) {
        cleanupMarker(universityMarkerRef.current)
        universityMarkerRef.current = null
      }

      addressMarkersRef.current.forEach((marker) => cleanupMarker(marker))
      addressMarkersRef.current = []

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

  // Window resize handler
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return

    let resizeTimer: NodeJS.Timeout

    const handleResize = () => {
      if (!mapRef.current) return

      mapRef.current.resize()

      // Re-fit bounds on resize for optimal view
      mapRef.current.fitBounds(NEWCASTLE_BOUNDS, {
        padding: getResponsivePadding(),
        duration: FIT_BOUNDS_DURATION_RESIZE,
        maxZoom: MAX_ZOOM,
        essential: true,
      })
    }

    const debouncedResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleResize, DEBOUNCE_DELAY)
    }

    window.addEventListener('resize', debouncedResize)

    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(resizeTimer)
    }
  }, [isMapLoaded])

  return (
    <div style={{ position: 'relative', height: '500px', width: '100%' }}>
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <p className="text-sm text-muted-foreground">
            {process.env.NODE_ENV === 'development'
              ? 'Map initialization error - check MAPBOX_TOKEN'
              : 'Map unavailable'}
          </p>
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
