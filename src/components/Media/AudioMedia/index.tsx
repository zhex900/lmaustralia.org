'use client'

import { cn } from '@/utilities/ui'
import React, { useRef, useEffect, useState } from 'react'
import { useAudioContext } from '@/providers/AudioProvider'
import { Skeleton } from '@/components/ui/skeleton'
import { EllipsisVertical, Play, Volume2 } from 'lucide-react'
import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

const AudioSkeleton = () => {
  return (
    <div className={cn('h-[54px] flex items-center gap-4 px-4 bg-background rounded-4xl')}>
      {/* Play button */}
      <Play className="w-4 h-4 animate-pulse text-muted flex-shrink-0" fill="currentColor" />
      {/* Time display */}
      <Skeleton className="w-20 h-4" />
      {/* Progress bar */}
      <Skeleton className="flex-1 h-1 rounded-full" />

      {/* Volume control */}
      <Volume2
        className="-mr-2 w-5 h-5 animate-pulse text-muted flex-shrink-0"
        fill="currentColor"
      />
      <EllipsisVertical
        className="w-5 h-5 animate-pulse text-muted flex-shrink-0"
        fill="currentColor"
      />
    </div>
  )
}

export const AudioMedia: React.FC<MediaProps> = (props) => {
  const { resource, className } = props

  const audioRef = useRef<HTMLAudioElement>(null)
  const { registerAudio, unregisterAudio, pauseAllExcept } = useAudioContext()
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Register this audio player
    registerAudio(audioRef)

    // Setup play event listener on the actual audio element
    const audioElement = audioRef.current

    if (audioElement) {
      // Check if audio is already ready
      if (audioElement.readyState >= 2) {
        setIsReady(true)
      }

      // Ensure metadata is loaded so seeking works
      // This allows users to seek even on paused audio
      if (audioElement.readyState < 1) {
        audioElement.load()
      }

      return () => {
        unregisterAudio(audioRef)
      }
    }

    return () => {
      unregisterAudio(audioRef)
    }
  }, [registerAudio, unregisterAudio, pauseAllExcept])

  const handlePlay = () => {
    pauseAllExcept(audioRef)
  }

  const handleLoadedData = () => {
    setIsReady(true)
  }

  const handleError = () => {
    setHasError(true)
    setIsReady(true)
  }

  const getMimeType = (name: string): string | undefined => {
    const extension = name.split('.').pop()?.toLowerCase()

    if (extension === 'm4a') return 'audio/mp4'
    if (extension === 'mp3') return 'audio/mpeg'
    if (extension === 'wav') return 'audio/wav'
    if (extension === 'ogg' || extension === 'oga') return 'audio/ogg'

    return undefined
  }

  if (resource && typeof resource === 'object') {
    const { filename, alt } = resource
    if (!filename) return null

    const src = getMediaUrl(`/api/media/file/${filename}`)
    const mimeType = getMimeType(filename)

    return (
      <div className="relative inline-block w-full md:max-w-md">
        {!isReady && (
          <div className="absolute inset-0">
            <AudioSkeleton />
          </div>
        )}
        <audio
          ref={audioRef}
          className={cn('w-full', className, !isReady && 'opacity-0 pointer-events-none')}
          controls
          preload="metadata"
          onPlay={handlePlay}
          onLoadedData={handleLoadedData}
          onError={handleError}
          aria-label={alt || 'Audio playback'}
        >
          <source src={src} type={mimeType} />
          <source src={src} />
          Your browser does not support the audio element.
        </audio>
        {hasError && (
          <p className="mt-2 text-sm text-destructive">
            We could not load this audio file. Please try refreshing the page.
          </p>
        )}
      </div>
    )
  }

  return null
}
