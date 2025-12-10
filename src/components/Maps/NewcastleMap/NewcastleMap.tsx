'use client'

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import { addAllLayers } from './layers'
import { useCatchmentHighlight } from './layers/catchment'
import { showRoute, clearRoute } from './routing'
import { LayerControls } from './LayerControls'

export const NewcastleMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const addressMarkersRef = useRef<mapboxgl.Marker[]>([])
  const routeSourceRef = useRef<string | null>(null) // Track current route source
  const popupRef = useRef<mapboxgl.Popup | null>(null) // Track current popup
  const activeRouteRef = useRef<string | null>(null) // Track which marker's route is active
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  // Use React hook for catchment highlighting
  const { highlightCatchment, unhighlightCatchment, highlightedCatchmentRef } =
    useCatchmentHighlight(mapRef)

  // Initialize map (only once)
  useEffect(() => {
    if (!mapContainerRef.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      console.error('NEXT_PUBLIC_MAPBOX_TOKEN is not set')
      return
    }

    // University of Newcastle coordinates
    const universityCoords: [number, number] = [151.71786849703244, -32.90489225775947]

    // Function to get route from home to university and display it
    const showRouteToUniversity = async (fromCoords: [number, number], label: string) => {
      await showRoute({
        mapRef,
        routeSourceRef,
        popupRef,
        activeRouteRef,
        fromCoords,
        // uni front gate coords
        toCoords: [151.69800570206968, -32.895359349770544],
        label,
        token,
      })
    }

    // Function to clear route when clicking outside
    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      // Only clear if clicking on the map itself (not on a marker or popup)
      const target = e.originalEvent?.target as HTMLElement
      if (target) {
        // Check if click is on map canvas and not on a marker or popup
        const isMarker = target.closest('.mapboxgl-marker') || target.closest('.custom-marker')
        const isPopup = target.closest('.mapboxgl-popup')

        if (target.classList.contains('mapboxgl-canvas') && !isMarker && !isPopup) {
          clearRoute({ mapRef, routeSourceRef, popupRef, activeRouteRef })
        }
      }
    }

    mapboxgl.accessToken = token
    const initialCenter: [number, number] = [151.71986874228838, -32.8990780958905]
    const initialZoom = 10.8

    // Newcastle area bounding box: [[west, south], [east, north]]
    const maxBounds: [[number, number], [number, number]] = [
      [151.5, -33.0], // Southwest corner
      [151.9, -32.7], // Northeast corner
    ]

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Single style
      center: initialCenter, // University of Newcastle (Callaghan campus) [lng, lat]
      zoom: initialZoom, // starting zoom
      minZoom: 10,
      maxBounds, // Constrain map to Newcastle area
      attributionControl: false, // Hide attribution control
      // Allow zoom and panning within bounds
      scrollZoom: false, // Enable mouse wheel zoom
      doubleClickZoom: true, // Enable double-click zoom
      touchZoomRotate: true, // Enable touch zoom
      boxZoom: false,
      dragRotate: false,
      dragPan: true, // Allow panning within NSW bounds
      keyboard: false,
    })

    // Log initial map center and zoom
    console.log('Map initialized - Center:', initialCenter, 'Zoom:', initialZoom)

    // Log center and zoom on move/zoom events
    mapRef.current.on('moveend', () => {
      if (mapRef.current) {
        const center = mapRef.current.getCenter()
        const zoom = mapRef.current.getZoom()
        console.log('Map moved - Center:', [center.lng, center.lat], 'Zoom:', zoom.toFixed(2))
      }
    })

    mapRef.current.on('zoomend', () => {
      if (mapRef.current) {
        const center = mapRef.current.getCenter()
        const zoom = mapRef.current.getZoom()
        console.log('Map zoomed - Center:', [center.lng, center.lat], 'Zoom:', zoom.toFixed(2))
      }
    })

    // Add click handler to clear routes when clicking on the map
    mapRef.current.on('click', handleMapClick)

    // Hide Mapbox logo and attribution, and add marker
    mapRef.current.on('load', async () => {
      if (!mapRef.current) return

      // Log center and zoom after map loads
      const center = mapRef.current.getCenter()
      const zoom = mapRef.current.getZoom()
      console.log('Map loaded - Center:', [center.lng, center.lat], 'Zoom:', zoom.toFixed(2))

      // Add all layers using the layer components
      if (!markerRef.current) {
        markerRef.current = await addAllLayers({
          map: mapRef.current,
          token,
          universityCoords,
          onRouteShow: showRouteToUniversity,
          onCatchmentHighlight: highlightCatchment,
          onCatchmentUnhighlight: unhighlightCatchment,
          highlightedCatchmentRef,
          addressMarkersRef,
        })
      }

      // Mark map as loaded
      setIsMapLoaded(true)
    })

    // Cleanup function to prevent memory leaks
    return () => {
      markerRef.current?.remove()
      addressMarkersRef.current.forEach((marker) => marker.remove())
      mapRef.current?.remove()
    }
  }, []) // Only run once on mount

  return (
    <div style={{ position: 'relative', height: '500px', width: '100%' }}>
      <div
        ref={mapContainerRef}
        style={{ height: '100%', width: '100%' }}
        className="map-container rounded-lg"
      />

      {isMapLoaded && <LayerControls mapRef={mapRef} addressMarkersRef={addressMarkersRef} />}
    </div>
  )
}
