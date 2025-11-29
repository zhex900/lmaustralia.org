// Australia bounding box for coordinate conversion
// Latitude: approximately -10° to -44° (South is negative)
// Longitude: approximately 113° to 154° (East is positive)
export const AUSTRALIA_BOUNDS = {
  minLat: -44.0,
  maxLat: -10.0,
  minLng: 113.0,
  maxLng: 156.0,
}

// Calculate center and bounds for Australia
const centerLat = (AUSTRALIA_BOUNDS.maxLat + AUSTRALIA_BOUNDS.minLat) / 2
const centerLng = (AUSTRALIA_BOUNDS.maxLng + AUSTRALIA_BOUNDS.minLng) / 2
export const AUSTRALIA_CENTER: [number, number] = [centerLng, centerLat]

export const AUSTRALIA_BOUNDS_COORDS: [[number, number], [number, number]] = [
  [AUSTRALIA_BOUNDS.minLng, AUSTRALIA_BOUNDS.minLat], // Southwest corner
  [AUSTRALIA_BOUNDS.maxLng, AUSTRALIA_BOUNDS.maxLat], // Northeast corner
]

// SVG dimensions
export const SVG_WIDTH = 1000
export const SVG_HEIGHT = 966
