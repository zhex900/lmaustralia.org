import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { AudioProvider } from './AudioProvider'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <AudioProvider>{children}</AudioProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
