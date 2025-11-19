'use client'

import React from 'react'
import { AustraliaMap } from './AustraliaMap'

export const HeroAustraliaMap = () => {
  const mapRef = React.useRef<HTMLDivElement | null>(null)
  const [centerPx, setCenterPx] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [topOffset, setTopOffset] = React.useState<number>(0)
  React.useEffect(() => {
    const updateTopOffset = () => {
      setTopOffset(-100 + window.innerHeight / 2 - centerPx.y)
    }
    updateTopOffset()
    window.addEventListener('resize', updateTopOffset)
    return () => window.removeEventListener('resize', updateTopOffset)
  }, [centerPx.y, centerPx.x])

  React.useEffect(() => {
    const el = mapRef.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      setCenterPx({ x: Math.round(rect.width / 2), y: Math.round(rect.height / 2) })
    }

    update()

    const ro = new ResizeObserver(() => update())
    ro.observe(el)

    return () => {
      ro.disconnect()
    }
  }, [])

  return (
    <div
      className="absolute z-0 left-1/2 -translate-x-1/2 w-[100%] lg:w-[80%] xl:w-[70%] 2xl:w-[60%] pointer-events-none"
      style={{ top: `${topOffset}px` }}
    >
      <AustraliaMap ref={mapRef} />
    </div>
  )
}
