import sharp from 'sharp'
import toIco from 'to-ico'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

const svgPath = join(projectRoot, 'public', 'favicon.svg')
const icoPath = join(projectRoot, 'public', 'favicon.ico')

// Sizes for ICO file (multiple sizes for better compatibility)
const sizes = [16, 32, 48, 64]

async function convertSvgToIco() {
  try {
    console.log('Reading SVG file...')
    const svgBuffer = readFileSync(svgPath)

    console.log('Converting SVG to PNG at multiple sizes...')
    const pngBuffers = await Promise.all(
      sizes.map(async (size) => {
        const pngBuffer = await sharp(svgBuffer)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
          })
          .png()
          .toBuffer()
        return pngBuffer
      }),
    )

    console.log('Creating ICO file...')
    const icoBuffer = await toIco(pngBuffers, {
      sizes: sizes,
    })

    console.log('Writing ICO file...')
    writeFileSync(icoPath, icoBuffer)

    console.log(`✅ Successfully converted ${svgPath} to ${icoPath}`)
  } catch (error) {
    console.error('Error converting SVG to ICO:', error)
    process.exit(1)
  }
}

convertSvgToIco()
