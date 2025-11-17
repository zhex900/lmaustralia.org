import { Heart } from 'lucide-react'

export const CairnsMap = () => {
  return (
    <div className="absolute top-3 right-3 w-[140px]">
      <img
        data-src="https://tasmania.com/wp-content/themes/tasmania/img/map-of-tasmania.png"
        className="loaded"
        src="https://tasmania.com/wp-content/themes/tasmania/img/map-of-tasmania.png"
        data-was-processed="true"
      ></img>

      <span className="absolute left-2/3 top-[70px] -translate-x-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center">
        <span className="absolute inline-flex h-5 w-5 rounded-full bg-red-500/40 animate-ping"></span>
        <span className="absolute inline-flex h-4 w-4 rounded-full bg-red-600"></span>
        <Heart className="relative h-3 w-3 text-red-100 animate-pulse" />
      </span>
    </div>
  )
}
