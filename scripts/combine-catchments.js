import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import * as turf from '@turf/turf'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const inputPath = join(
  __dirname,
  '../src/components/Maps/NewcastleMap/geojson/school-catchments.json',
)
const outputPath = join(
  __dirname,
  '../src/components/Maps/NewcastleMap/geojson/school-catchments.json',
)

try {
  // Read the input file
  const data = JSON.parse(readFileSync(inputPath, 'utf8'))

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Input file must be an array of GeoJSON features')
  }

  // Extract all polygons from the features
  const polygons = data
    .filter((feature) => feature.geometry && feature.geometry.type === 'Polygon')
    .map((feature) => ({
      type: 'Feature',
      geometry: feature.geometry,
      properties: {},
    }))

  if (polygons.length === 0) {
    throw new Error('No polygons found in the input file')
  }

  console.log(`Found ${polygons.length} polygons to combine...`)

  // Use union to combine all polygons (removes inner boundaries)
  console.log('Combining all polygons using union...')
  let combined

  if (polygons.length === 1) {
    combined = polygons[0]
  } else {
    // Create a FeatureCollection with all polygons
    const featureCollection = turf.featureCollection(polygons)

    // Union takes a single FeatureCollection and returns the union of all features
    try {
      const unioned = turf.union(featureCollection)

      if (unioned && unioned.geometry) {
        // Union returns a Feature (polygon or multipolygon)
        combined = unioned
      } else {
        throw new Error('Union returned invalid result')
      }
    } catch (error) {
      console.error('Error during union operation:', error.message)
      throw error
    }
  }

  // Create the final FeatureCollection
  const result = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'Combined School Catchments',
          description: 'Union of all school catchment boundaries',
        },
        geometry: combined.geometry,
      },
    ],
  }

  // Write the output file
  writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8')

  console.log('✅ Successfully combined all catchments!')
  console.log(`📁 Output saved to: ${outputPath}`)
  console.log(`📊 Result: Single polygon with ${combined.geometry.coordinates[0].length} points`)
} catch (error) {
  console.error('❌ Error combining catchments:', error)
  process.exit(1)
}
