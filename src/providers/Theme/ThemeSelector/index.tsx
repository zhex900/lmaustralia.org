'use client'

import React from 'react'
import { Moon, Sun, Laptop } from 'lucide-react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'
import clsx from 'clsx'

interface ThemeSelectorProps {
  className?: string
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { setTheme } = useTheme()
  const [value, setValue] = React.useState<'auto' | Theme>('auto')

  const setThemeMode = (mode: 'auto' | Theme) => {
    if (mode === 'auto') {
      setTheme(null)
      setValue('auto')
    } else {
      setTheme(mode)
      setValue(mode)
    }
  }

  const cycle = () => {
    const next: 'auto' | Theme = value === 'auto' ? 'light' : value === 'light' ? 'dark' : 'auto'
    setThemeMode(next)
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey) as Theme | null
    setValue(preference ?? 'auto')
  }, [])

  const label = value === 'auto' ? 'System (Auto)' : value === 'light' ? 'Light' : 'Dark'
  const Icon = value === 'auto' ? Laptop : value === 'light' ? Sun : Moon

  return (
    <button
      type="button"
      className={clsx(
        'h-8 w-8 inline-flex items-center rounded-md justify-center hover:bg-muted transition-colors',
        className,
      )}
      onClick={cycle}
      aria-label={label}
      title={label}
    >
      <Icon className="h-5 w-5" />
      <span className="sr-only">{label}</span>
    </button>
  )
}
