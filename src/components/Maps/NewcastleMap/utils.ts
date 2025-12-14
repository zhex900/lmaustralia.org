import mapboxgl from 'mapbox-gl'

export const toggleLayerVisibility = (
  map: mapboxgl.Map | null,
  layerIds: string[],
  visible: boolean,
) => {
  if (!map) return

  const visibility = visible ? 'visible' : 'none'

  layerIds.forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visibility)
    }
  })
}

export const toggleMarkersVisibility = (
  markers: mapboxgl.Marker[],
  visible: boolean,
  filterFn?: (element: HTMLElement) => boolean,
) => {
  markers.forEach((marker) => {
    const element = marker.getElement()
    if (element) {
      if (!filterFn || filterFn(element)) {
        element.style.display = visible ? 'block' : 'none'
      }
    }
  })
}
