export type PinName = 'Newcastle' | 'Cairns' | 'Launceston'

export const pinPositions: {
  name: PinName
  href: string
  coords: {
    x: number
    y: number
  }
}[] = [
  {
    name: 'Newcastle',
    href: '/posts/newcastle',
    coords: {
      x: 930,
      y: 590,
    },
  },
  {
    name: 'Cairns',
    href: '/posts/cairns',
    coords: {
      x: 760,
      y: 190,
    },
  },
  {
    name: 'Launceston',
    href: '/posts/launceston',
    coords: {
      x: 790,
      y: 850,
    },
  },
]
