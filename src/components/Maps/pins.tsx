import { AUSTRALIA_BOUNDS, SVG_WIDTH, SVG_HEIGHT } from './constants'

export type PinName = 'Newcastle' | 'Cairns' | 'Launceston' | 'Sydney' | 'Melbourne'

/**
 * Convert latitude/longitude to SVG x/y coordinates
 * @param lat Latitude (-44 to -10 for Australia)
 * @param lng Longitude (113 to 154 for Australia)
 * @returns SVG coordinates {x, y}
 */
export function latLngToSvgCoords(lat: number, lng: number): { x: number; y: number } {
  // Normalize longitude to 0-1 range (X axis)
  const normalizedX =
    (lng - AUSTRALIA_BOUNDS.minLng) / (AUSTRALIA_BOUNDS.maxLng - AUSTRALIA_BOUNDS.minLng)

  // Normalize latitude to 0-1 range (Y axis)
  // Note: SVG Y increases downward, but latitude increases upward, so we flip it
  const normalizedY =
    1 - (lat - AUSTRALIA_BOUNDS.minLat) / (AUSTRALIA_BOUNDS.maxLat - AUSTRALIA_BOUNDS.minLat)

  return {
    x: normalizedX * SVG_WIDTH,
    y: normalizedY * SVG_HEIGHT,
  }
}

const pinData: {
  name: PinName
  href: string
  lat: number // Latitude
  lng: number // Longitude
}[] = [
  {
    name: 'Newcastle',
    href: '/posts/newcastle',
    lat: -32.9283, // Newcastle, NSW latitude
    lng: 151.7817, // Newcastle, NSW longitude
  },
  {
    name: 'Cairns',
    href: '/posts/cairns',
    lat: -16.9186, // Cairns, QLD latitude
    lng: 145.7781, // Cairns, QLD longitude
  },
  {
    name: 'Launceston',
    href: '/posts/launceston',
    lat: -41.4332, // Launceston, TAS latitude
    lng: 147.1441, // Launceston, TAS longitude
  },
  //sydney
  {
    name: 'Sydney',
    href: '/posts/sydney',
    lat: -33.8688, // Sydney, NSW latitude
    lng: 151.2093, // Sydney, NSW longitude
  },
  //melbourne
  {
    name: 'Melbourne',
    href: '/posts/melbourne',
    lat: -37.8136, // Melbourne, VIC latitude
    lng: 144.9631, // Melbourne, VIC longitude
  },
  //brisbane
  {
    name: 'Brisbane',
    href: '/posts/brisbane',
    lat: -27.4701, // Brisbane, QLD latitude
    lng: 153.0235, // Brisbane, QLD longitude
  },
  //hobart
  {
    name: 'Hobart',
    href: '/posts/hobart',
    lat: -42.8821, // Hobart, TAS latitude
    lng: 147.3272, // Hobart, TAS longitude
  },
  //wollongong
  {
    name: 'Wollongong',
    href: '/posts/wollongong',
    lat: -34.4257, // Wollongong, NSW latitude
    lng: 150.8931, // Wollongong, NSW longitude
  },
  //canberra
  {
    name: 'Canberra',
    href: '/posts/canberra',
    lat: -35.2809, // Canberra, ACT latitude
    lng: 149.13, // Canberra, ACT longitude
  },
]

export const pinPositions: {
  name: PinName
  href: string
  lat: number // Latitude
  lng: number // Longitude
  coords: {
    x: number
    y: number
  }
}[] = pinData.map((pin) => ({
  ...pin,
  coords: latLngToSvgCoords(pin.lat, pin.lng),
}))
