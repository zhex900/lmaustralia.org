'use client'

import { cn } from '@/utilities/ui'
import React, { useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const AudioMedia: React.FC<MediaProps> = (props) => {
  const { resource, className } = props

  const audioRef = useRef<HTMLAudioElement>(null)

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
