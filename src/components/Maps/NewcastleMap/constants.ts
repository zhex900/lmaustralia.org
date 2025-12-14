export const UNIVERSITY_COORDS: [number, number] = [151.71786849703244, -32.90489225775947]
export const UNI_FRONT_GATE_COORDS: [number, number] = [151.69800570206968, -32.895359349770544]
export const UNI_MARKER_COORDS: [number, number] = [151.7024147191538, -32.89685983195183]

// Newcastle area bounds - [southwest, northeast]
export const NEWCASTLE_BOUNDS: [[number, number], [number, number]] = [
  [151.65057615209156, -32.93964019315944], // Southwest corner [west, south]
  [151.79459561400955, -32.87786655130743], // Northeast corner [east, north]
]

export const MIN_ZOOM = 10
export const MAX_BOUNDS: [[number, number], [number, number]] = NEWCASTLE_BOUNDS

// Map view configuration
export const MAX_ZOOM = 15
export const FIT_BOUNDS_DURATION_INITIAL = 0 // Instant on load
export const FIT_BOUNDS_DURATION_RESIZE = 1000 // 1 second transition on resize

// Responsive padding breakpoints
export const MOBILE_BREAKPOINT = 640
export const TABLET_BREAKPOINT = 1024
export const PADDING_MOBILE = 20
export const PADDING_TABLET = 40
export const PADDING_DESKTOP = 60

// UI timing
export const TOOLTIP_AUTO_CLOSE_DELAY = 1500 // ms
export const DEBOUNCE_DELAY = 250 // ms

// Route styling
export const ROUTE_LINE_WIDTH = 4
export const ROUTE_LINE_COLOR = '#3b82f6'
export const ROUTE_LINE_OPACITY = 0.8

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
