import type { Feature, Geometry, FeatureCollection } from 'geojson'

export interface RouteGeometry {
  type: 'LineString'
  coordinates: [number, number][]
}

export interface RouteFeature extends Feature {
  type: 'Feature'
  geometry: RouteGeometry
  properties: Record<string, unknown>
}

export interface MapboxRoute {
  distance: number
  duration: number
  geometry: RouteGeometry
}

export interface MapboxDirectionsResponse {
  routes: MapboxRoute[]
  code: string
}

export interface MapboxGeocodingFeature {
  center: [number, number]
  place_name: string
  geometry: Geometry
  properties: Record<string, unknown>
}

export interface MapboxGeocodingResponse {
  features: MapboxGeocodingFeature[]
  type: 'FeatureCollection'
}

export type GeoJSONFeatureCollection = FeatureCollection
