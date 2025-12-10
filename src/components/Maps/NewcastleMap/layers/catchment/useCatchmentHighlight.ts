import React, { useRef, useCallback } from 'react'

import { showCatchmentLayer, hideCatchmentLayer } from './CatchmentLayers'

// React hook for managing catchment highlighting
export const useCatchmentHighlight = (mapRef: React.RefObject<mapboxgl.Map | null>) => {
  const highlightedCatchmentRef = useRef<string | null>(null)

  const highlightCatchment = useCallback(
    (sourceId: string) => {
      const map = mapRef.current
      if (!map) return

      // Extract catchment ID from sourceId (format: "catchment-{catchmentId}")
      const catchmentId = sourceId.replace('catchment-', '')

      // Show the individual catchment layer
      showCatchmentLayer(map, catchmentId)

      highlightedCatchmentRef.current = sourceId
    },
    [mapRef],
  )

  const unhighlightCatchment = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    // Hide individual catchment and show combined layer
    hideCatchmentLayer(map)

    highlightedCatchmentRef.current = null
  }, [mapRef])

  return {
    highlightCatchment,
    unhighlightCatchment,
    highlightedCatchmentRef,
  }
}
