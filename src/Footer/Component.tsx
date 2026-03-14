import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { site } from '@/constants'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="dark:bg-gray-900 bg-gray-50 dark:text-white text-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link className="flex items-center" href="/">
            <Logo />
          </Link>

          <div>
            <h4 className=" font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {navItems.map(({ link, id }) => {
                return (
                  <li key={id}>
                    <Link href={link.url || ''} className="hover:text-sky-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Participation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-sky-400 transition-colors text-sm">
                  Enquiry
                </Link>
              </li>
              <li>
                <Link href="/praying" className="hover:text-sky-400 transition-colors">
                  Prayers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>
            <Link href="/" className="hover:text-sky-400 transition-colors">
              &copy; {new Date().getFullYear()} {site.name}
            </Link>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
