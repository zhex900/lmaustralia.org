'use client'

import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState, useRef, useEffect } from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)
  const lastOutsideClickTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!isExpanded) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (bannerRef.current && !bannerRef.current.contains(target)) {
        const now = Date.now()
        const timeSinceLastClick = now - lastOutsideClickTimeRef.current

        // Double click detection (within 300ms)
        if (timeSinceLastClick < 300 && timeSinceLastClick > 0) {
          setIsExpanded(false)
          lastOutsideClickTimeRef.current = 0 // Reset
        } else {
          lastOutsideClickTimeRef.current = now
        }
      }
    }

    // Use React's recommended approach with passive listeners where possible
    const options = { passive: true }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside, options)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isExpanded])

  const handleBannerClick = () => {
    // Single click: expand if collapsed, do nothing if expanded
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }

  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div
        ref={bannerRef}
        onClick={handleBannerClick}
        className={cn(
          'border py-4 px-6 rounded cursor-pointer overflow-y-auto transition-all delay-75 duration-1000 ease-in-out',
          {
            'max-h-60 hover:max-h-150': !isExpanded,
            'max-h-150': isExpanded,
            'border-border bg-quote': style === 'info',
            'border-error bg-error/30': style === 'error',
            'border-success bg-success/30': style === 'success',
            'border-warning bg-warning/30': style === 'warning',
          },
        )}
      >
        <RichText
          data={content}
          enableGutter={false}
          enableProse={true}
          className="font-playfair  "
        />
      </div>
    </div>
  )
}
