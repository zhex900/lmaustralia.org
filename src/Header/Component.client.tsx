'use client'
import Link from 'next/link'
import React, { useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

import { SearchIcon } from 'lucide-react'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme] = useState<string | null>(null)

  return (
    <header className="px-5 md:px-10 py-8 z-20 " {...(theme ? { 'data-theme': theme } : {})}>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Left: Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Center: Nav */}
        <div className="mx lg:mx-auto">
          <HeaderNav data={data} />
        </div>

        {/* Right: Utilities */}
        <div className="items-center flex gap-3 justify-end">
          <Link
            href="/search"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors"
          >
            <span className="sr-only">Search</span>
            <SearchIcon className="w-5 h-5 text-primary" />
          </Link>
          <ThemeSelector className="flex" />
        </div>
      </div>
    </header>
  )
}
