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
    return (
      <AustraliaMap pins={[pin]} pinSize={3} showPinLabel={false} mapClassName="fill-amber-200 " />
    )
  }
  return null
}
