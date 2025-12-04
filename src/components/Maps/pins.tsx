export type PinName = 'Newcastle' | 'Cairns' | 'Launceston'

export const pinPositions: {
  name: PinName
  href: string
  lat: number // Latitude
  lng: number // Longitude
  labelOffsetX?: number
}[] = [
  {
    name: 'Newcastle',
    href: '/posts/newcastle',
    lat: -32.9283, // Newcastle, NSW latitude
    lng: 151.7817, // Newcastle, NSW longitude
    labelOffsetX: -22,
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
]
