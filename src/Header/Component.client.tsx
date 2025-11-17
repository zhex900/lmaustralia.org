'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

import { SearchIcon } from 'lucide-react'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="container py-4 relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <div className="py-8 mx-auto">
          <HeaderNav data={data} />
        </div>
        <div className="items-center flex gap-3">
          <Link
            href="/search"
            className="h-8 w-8 inline-flex items-center justify-center hover:bg-muted transition-colors"
          >
            <span className="sr-only">Search</span>
            <SearchIcon className="w-5 text-primary" />
          </Link>
          <ThemeSelector className="hidden sm:flex" />
        </div>
      </div>
    </header>
  )
}
