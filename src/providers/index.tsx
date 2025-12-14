import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { AudioProvider } from './AudioProvider'
import { ReCaptchaProvider } from './ReCaptcha'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <AudioProvider>
          <ReCaptchaProvider>{children}</ReCaptchaProvider>
        </AudioProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
