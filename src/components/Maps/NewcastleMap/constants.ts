export const UNIVERSITY_COORDS: [number, number] = [151.71786849703244, -32.90489225775947]
export const UNI_FRONT_GATE_COORDS: [number, number] = [151.69800570206968, -32.895359349770544]
export const UNI_MARKER_COORDS: [number, number] = [151.7024147191538, -32.89485983195183]

// Newcastle area bounds - [southwest, northeast]
export const NEWCASTLE_BOUNDS: [[number, number], [number, number]] = [
  [151.65057615209156, -32.93964019315944], // Southwest corner [west, south]
  [151.79459561400955, -32.87786655130743], // Northeast corner [east, north]
]

export const MIN_ZOOM = 10
export const MAX_BOUNDS: [[number, number], [number, number]] = NEWCASTLE_BOUNDS

export const HOME_MARKERS = [
  {
    label: 'J & A',
    coordinates: [151.68806500859893, -32.894431382496684] as [number, number],
  },
  {
    coordinates: [151.67687409325748, -32.9359213992419] as [number, number],
    label: 'J & T',
  },
  {
    coordinates: [151.71606477049914, -32.9114411278816] as [number, number],
    label: 'D & S',
  },
  {
    coordinates: [151.690008262567, -32.87665511446352] as [number, number],
    label: 'D & M',
  },
]
