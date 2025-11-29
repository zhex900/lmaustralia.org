'use client'

import { cn } from '@/utilities/ui'
import React, { useRef, useEffect, useState } from 'react'
import { PinName, pinPositions } from './pins'
import { AUSTRALIA_CENTER, AUSTRALIA_BOUNDS_COORDS } from './constants'
import australia from './australia.json'
import { createPulsingDot } from './createPulsingDot'
import dynamic from 'next/dynamic'

// Load Mapbox CSS asynchronously (non-blocking)
const loadMapboxCSS = () => {
  if (typeof window === 'undefined') return

  const existingLink = document.querySelector('link[href*="mapbox-gl"]')
  if (existingLink) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.16.0/mapbox-gl.css'
  link.crossOrigin = 'anonymous'
  // Use media="print" trick to load CSS asynchronously
  link.media = 'print'
  link.onload = () => {
    link.media = 'all'
  }
  document.head.appendChild(link)
}

const Map = dynamic(() => import('react-map-gl/mapbox').then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
      <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
    </div>
  ),
})

const Source = dynamic(() => import('react-map-gl/mapbox').then((mod) => mod.Source), {
  ssr: false,
})

const Layer = dynamic(() => import('react-map-gl/mapbox').then((mod) => mod.Layer), {
  ssr: false,
})

const Marker = dynamic(() => import('react-map-gl/mapbox').then((mod) => mod.Marker), {
  ssr: false,
})

import type { MapRef } from 'react-map-gl/mapbox'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

type AustraliaMapProps = {
  showPinLabel?: boolean
  pinSize?: number
  className?: string
  // which pins to show, default is all
  pins?: 'all' | PinName[]
  debug?: boolean
  children?: React.ReactNode
}

const defaultPinSize = 0.5

export const AustraliaMap = React.forwardRef<HTMLDivElement, AustraliaMapProps>(
  (
    {
      showPinLabel = true,
      pinSize = defaultPinSize,
      className,
      pins = 'all',
      children,
    }: AustraliaMapProps,
    ref,
  ) => {
    const mapRef = useRef<MapRef | null>(null)
    const [mapKey, setMapKey] = useState(0)
    const [shouldLoadMap, setShouldLoadMap] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)

    // Use Intersection Observer to only load map when it's in viewport
    useEffect(() => {
      const container = containerRef.current || (typeof ref === 'object' && ref?.current)
      if (!container || shouldLoadMap) return

      // Use Intersection Observer with a small delay to defer loading
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            // Load CSS immediately (non-blocking)
            loadMapboxCSS()

            // Defer JS loading until browser is idle
            if (window.requestIdleCallback) {
              window.requestIdleCallback(
                () => {
                  setShouldLoadMap(true)
                },
                { timeout: 2000 },
              )
            } else {
              setTimeout(() => {
                setShouldLoadMap(true)
              }, 100)
            }
            observer.disconnect()
          }
        },
        {
          rootMargin: '50px', // Start loading 50px before entering viewport
        },
      )

      observer.observe(container)

      return () => {
        observer.disconnect()
      }
    }, [ref, shouldLoadMap])

    // Reload map on screen size changes by remounting with new key
    useEffect(() => {
      if (!shouldLoadMap) return

      const handleResize = () => {
        // Force remount by changing key to reload the map
        setMapKey((prev) => prev + 1)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [shouldLoadMap])

    // Use center and bounds from constants
    const center = AUSTRALIA_CENTER
    const bounds = AUSTRALIA_BOUNDS_COORDS

    // Filter pins to show
    const pinsToShow = pinPositions.filter(
      (pin) => pins === 'all' || (Array.isArray(pins) && pins.includes(pin.name)),
    )

    // Pins GeoJSON FeatureCollection
    const pinsGeoJson = {
      type: 'FeatureCollection' as const,
      features: pinsToShow.map((pin) => ({
        type: 'Feature' as const,
        properties: {
          name: pin.name,
          href: pin.href,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [pin.lng, pin.lat],
        },
      })),
    }

    if (!MAPBOX_TOKEN) {
      console.warn('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set. Mapbox map will not render.')
      return (
        <div
          ref={ref}
          className={cn('flex items-center justify-center bg-gray-100 dark:bg-gray-800', className)}
          style={{ width: '100%', aspectRatio: '1000 / 966' }}
        >
          <p className="text-gray-500 dark:text-gray-400">Mapbox access token not configured</p>
        </div>
      )
    }
    // <div className="relative pointer-events-none" style={{ width }}>
    // Combine refs
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref],
    )

    return (
      <div
        ref={setRefs}
        className={cn('relative', className)}
        style={{
          width: '100%',
          // height: '100vh',
          aspectRatio: '1000 / 966',
          pointerEvents: 'none',
        }}
      >
        {shouldLoadMap ? (
          <Map
            key={mapKey}
            ref={mapRef}
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={{
              longitude: center[0],
              latitude: center[1],
              zoom: 4,
              bounds,
              fitBoundsOptions: {
                padding: 20,
                maxZoom: 6,
              },
            }}
            style={{ width: '100%', height: '100%' }}
            onLoad={() => {
              // Create pulsing dot after map loads
              if (mapRef.current) {
                const map = mapRef.current.getMap()
                createPulsingDot(map)
              }
            }}
            mapStyle={{
              version: 8,
              name: 'Empty Transparent',
              sources: {},
              layers: [
                {
                  id: 'background',
                  type: 'background',
                  paint: {
                    'background-color': 'transparent',
                  },
                },
              ],
              glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
            }}
            interactive={false}
            attributionControl={false}
          >
            {/* Australia Outline */}
            <Source id="australia" type="geojson" data={australia as any}>
              <Layer
                id="australia-fill"
                type="fill"
                paint={{
                  'fill-color': '#FF0000',
                  'fill-opacity': 0.5,
                }}
              />
            </Source>
            {/* Center Content */}
            {children && (
              <Marker longitude={center[0]} latitude={center[1]} anchor="center">
                {children}
              </Marker>
            )}
            <Source id="pins" type="geojson" data={pinsGeoJson}>
              <Layer
                id="pin-pulsing-dots"
                type="symbol"
                layout={{
                  'icon-image': 'pulsing-dot',
                  'icon-size': pinSize,
                  'icon-anchor': 'center',
                }}
              />

              {/* Pin labels - render last (on top of dots) */}
              {showPinLabel && (
                <Layer
                  id="pin-labels"
                  type="symbol"
                  layout={{
                    'text-field': ['get', 'name'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, -1.2],
                    'text-anchor': 'bottom',
                    'text-size': 14,
                  }}
                  paint={{
                    'text-color': '#ffffff',
                  }}
                />
              )}
            </Source>
          </Map>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
            <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
          </div>
        )}
      </div>
    )
  },
)

AustraliaMap.displayName = 'AustraliaMap'
