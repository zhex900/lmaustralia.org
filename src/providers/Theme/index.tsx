'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/utilities/canUseDOM'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  )

  const setTheme = useCallback((themeToSet: Theme | 'auto' | null) => {
    if (themeToSet === null || themeToSet === 'auto') {
      // Store 'auto' in localStorage to remember user selection
      if (themeToSet === 'auto') {
        window.localStorage.setItem(themeLocalStorageKey, 'auto')
      } else {
        window.localStorage.removeItem(themeLocalStorageKey)
      }
      const implicitPreference = getImplicitPreference()
      document.documentElement.setAttribute('data-theme', implicitPreference || defaultTheme)
      if (implicitPreference) setThemeState(implicitPreference)
      else setThemeState(defaultTheme)
    } else {
      setThemeState(themeToSet)
      window.localStorage.setItem(themeLocalStorageKey, themeToSet)
      document.documentElement.setAttribute('data-theme', themeToSet)
    }
  }, [])

  useEffect(() => {
    let themeToSet: Theme = defaultTheme
    const preference = window.localStorage.getItem(themeLocalStorageKey)

    if (preference === 'auto') {
      // User selected auto mode - use system preference
      const implicitPreference = getImplicitPreference()
      themeToSet = implicitPreference || defaultTheme
    } else if (themeIsValid(preference)) {
      // User selected light or dark explicitly
      themeToSet = preference
    }
    // If no preference exists, use defaultTheme (light)

    document.documentElement.setAttribute('data-theme', themeToSet)
    setThemeState(themeToSet)
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
