'use client'
import { useScroll, useTransform, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export interface TimelineEntry {
  title: string
  content: string | React.ReactNode
}

export const Timeline = ({
  title,
  description,
  timeline,
}: {
  title?: string
  description?: string
  timeline: TimelineEntry[]
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setHeight(rect.height)
    }
  }, [ref])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 20%'],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div className="w-full backdrop-blur-sm " ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        {title && <h2 className="text-xl md:text-4xl mb-4 max-w-4xl">{title}</h2>}
        {description && <p className=" text-sm md:text-base text-justify ">{description}</p>}
      </div>
      <div ref={ref} className="relative max-w-7xl mx-auto">
        {timeline.map((item, index) => (
          <div
            key={index}
            className="flex justify-start md:grid md:grid-cols-[fit-content(300px)_1fr] md:gap-10 pt-5 md:pt-10"
          >
            <div className="flex flex-col justify-center">
              <div className="h-5 w-5 absolute left-4 md:left-4 rounded-full bg-teal-500/80 dark:bg-amber-200/90 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-amber-200/50 dark:bg-teal-200/50  p-2" />
              </div>
              <div className="flex justify-center md:justify-start items-center">
                <h3 className="mt-[19px] hidden md:block text-xl md:pl-20 md:text-2xl font-bold ">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="relative pl-20 pr-4 md:pl-0 w-full flex flex-col justify-center">
              <h3 className="md:hidden block text-2xl text-left font-bold">{item.title}</h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + 'px',
          }}
          className="absolute left-6 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-linear-to-t from-amber-500 dark:from-teal-200 dark:via-amber-200 via-teal-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  )
}
