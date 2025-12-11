'use client'

import React, { createContext, useContext, useRef, useCallback } from 'react'

type AudioContextType = {
  registerAudio: (ref: React.RefObject<HTMLAudioElement | null>) => void
  unregisterAudio: (ref: React.RefObject<HTMLAudioElement | null>) => void
  pauseAllExcept: (exceptRef: React.RefObject<HTMLAudioElement | null>) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRefsRef = useRef<Set<React.RefObject<HTMLAudioElement | null>>>(new Set())

  const registerAudio = useCallback((ref: React.RefObject<HTMLAudioElement | null>) => {
    audioRefsRef.current.add(ref)
  }, [])

  const unregisterAudio = useCallback((ref: React.RefObject<HTMLAudioElement | null>) => {
    audioRefsRef.current.delete(ref)
  }, [])

  const pauseAllExcept = useCallback((exceptRef: React.RefObject<HTMLAudioElement | null>) => {
    audioRefsRef.current.forEach((ref) => {
      if (ref !== exceptRef && ref.current && !ref.current.paused) {
        ref.current.pause()
      }
    })
  }, [])

  return (
    <AudioContext.Provider value={{ registerAudio, unregisterAudio, pauseAllExcept }}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudioContext = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudioContext must be used within AudioProvider')
  }
  return context
}
