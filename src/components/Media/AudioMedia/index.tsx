'use client'

import { cn } from '@/utilities/ui'
import React, { useRef, useEffect } from 'react'
import { useAudioContext } from '@/providers/AudioProvider'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const AudioMedia: React.FC<MediaProps> = (props) => {
  const { resource, className } = props

  const audioRef = useRef<HTMLAudioElement>(null)
  const { registerAudio, unregisterAudio, pauseAllExcept } = useAudioContext()

  useEffect(() => {
    // Register this audio player
    registerAudio(audioRef)

    // Setup play event listener on the actual audio element
    const audioElement = audioRef.current

    if (audioElement) {
      // When this audio plays, pause all others
      // But allow seeking on all audio players (paused or playing)
      const handlePlayEvent = () => {
        pauseAllExcept(audioRef)
      }

      // Ensure controls are always enabled for seeking
      // The audio element naturally allows seeking even when paused
      audioElement.addEventListener('play', handlePlayEvent)

      // Ensure metadata is loaded so seeking works
      // This allows users to seek even on paused audio
      if (audioElement.readyState < 1) {
        audioElement.load()
      }

      return () => {
        audioElement.removeEventListener('play', handlePlayEvent)
        unregisterAudio(audioRef)
      }
    }

    return () => {
      unregisterAudio(audioRef)
    }
  }, [registerAudio, unregisterAudio, pauseAllExcept])

  if (resource && typeof resource === 'object') {
    const { filename, alt } = resource

    return (
      <audio
        ref={audioRef}
        className={cn(className)}
        controls
        preload="metadata"
        aria-label={alt || 'Audio playback'}
      >
        <source src={getMediaUrl(`/api/media/file/${filename}`)} />
        Your browser does not support the audio element.
      </audio>
    )
  }

  return null
}
