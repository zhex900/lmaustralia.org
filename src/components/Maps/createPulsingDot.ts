export const createPulsingDot = (map: mapboxgl.Map) => {
  const size = 100

  interface PulsingDot {
    width: number
    height: number
    data: Uint8Array
    context?: CanvasRenderingContext2D | null
    onAdd: () => void
    render: () => boolean
  }

  const pulsingDot: PulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
    onAdd: function () {
      const canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = this.height
      this.context = canvas.getContext('2d')
    },
    render: function () {
      const duration = 1000
      const t = (performance.now() % duration) / duration
      const radius = (size / 2) * 0.3
      const outerRadius = (size / 2) * 0.7 * t + radius
      const context = this.context

      if (!context) return false

      context.clearRect(0, 0, this.width, this.height)
      context.beginPath()
      context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
      context.fillStyle = `rgba(107, 114, 128, ${1 - t})` // gray-500 with fade
      context.fill()

      context.beginPath()
      context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
      context.fillStyle = 'rgba(107, 114, 128, 1)' // gray-500
      context.strokeStyle = 'white'
      context.lineWidth = 2 + 4 * (1 - t)
      context.fill()
      context.stroke()

      const imageData = context.getImageData(0, 0, this.width, this.height)
      this.data = new Uint8Array(imageData.data.buffer)

      map.triggerRepaint()

      return true
    },
  }

  map.addImage('pulsing-dot', pulsingDot as any, { pixelRatio: 2 })
}
