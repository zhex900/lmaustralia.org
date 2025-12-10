'use client'

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import { addAllLayers } from './layers'
import { useCatchmentHighlight } from './layers/catchment'
import { showRoute, clearRoute } from './routing'
import { LayerControls } from './LayerControls'
import {
  UNIVERSITY_COORDS,
  UNI_FRONT_GATE_COORDS,
  INITIAL_CENTER,
  INITIAL_ZOOM,
  MIN_ZOOM,
  MAX_BOUNDS,
} from './constants'

const MAP_OPTIONS: Omit<mapboxgl.MapboxOptions, 'container'> = {
  style: 'mapbox://styles/mapbox/streets-v12',
  center: INITIAL_CENTER,
  zoom: INITIAL_ZOOM,
  minZoom: MIN_ZOOM,
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to initialize map:', error)
      }
      setMapError(true)
      return
    }

    // Log center and zoom on move/zoom events
    mapRef.current.on('moveend', () => {
      if (mapRef.current) {
        const center = mapRef.current.getCenter()
        const zoom = mapRef.current.getZoom()
        // in dev mode log the center and zoom
        if (process.env.NODE_ENV === 'development') {
          console.log('Map moved - Center:', [center.lng, center.lat], 'Zoom:', zoom.toFixed(2))
        }
      }
    })

    mapRef.current.on('zoomend', () => {
      if (mapRef.current) {
        const center = mapRef.current.getCenter()
        const zoom = mapRef.current.getZoom()
        // in dev mode log the center and zoom
        if (process.env.NODE_ENV === 'development') {
          console.log('Map zoomed - Center:', [center.lng, center.lat], 'Zoom:', zoom.toFixed(2))
        }
      }
    })

    mapRef.current.on('click', handleMapClick)

    mapRef.current.on('load', async () => {
      if (!mapRef.current) return

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
