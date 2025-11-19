'use client'

import { AustraliaMap } from './AustraliaMap'

export const CityMap = ({ slug }: { slug: string }) => {
  const allowedPins = {
    newcastle: 'Newcastle',
    cairns: 'Cairns',
    launceston: 'Launceston',
  } as const

  const key = slug.toLowerCase() as keyof typeof allowedPins
  const pin = allowedPins[key]

  if (pin) {
    return <AustraliaMap pins={[pin]} showPinLabel={false} />
  }
  return null
}
