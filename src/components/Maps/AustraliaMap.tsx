'use client'

import { cn } from '@/utilities/ui'
import React, { useRef, useEffect, useState } from 'react'
import Map, { Source, Layer, Marker, type MapRef } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { PinName, pinPositions } from './pins'
import { AUSTRALIA_CENTER, AUSTRALIA_BOUNDS_COORDS } from './constants'
import australia from './australia.json'
import { createPulsingDot } from './createPulsingDot'

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

    // Reload map on screen size changes by remounting with new key
    useEffect(() => {
      const handleResize = () => {
        // Force remount by changing key to reload the map
        setMapKey((prev) => prev + 1)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])

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
    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        style={{
          width: '100%',
          // height: '100vh',
          aspectRatio: '1000 / 966',
          pointerEvents: 'none',
        }}
      >
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
      </div>
    )
  },
)

AustraliaMap.displayName = 'AustraliaMap'
