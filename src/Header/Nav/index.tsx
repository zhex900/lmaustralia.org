'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Menu, X } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [open, setOpen] = React.useState(false)

  const hasSubs = (item: any) => Array.isArray(item?.subNavItems) && item.subNavItems.length > 0

  const SubListDesktop = ({ items }: { items: any[] }) => (
    <div className="absolute left-0 top-full hidden group-hover:block">
      <div className="pt-2">
        <div className="rounded-md border bg-popover text-popover-foreground shadow">
          <ul className="min-w-[12rem] p-2">
            {items.map((sub: any, j: number) => (
              <li key={j}>
                <CMSLink
                  {...sub.link}
                  appearance="link"
                  className="block whitespace-nowrap px-2 py-1 hover:bg-muted rounded"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )

  const SubListMobile = ({ items }: { items: any[] }) => (
    <ul className="mt-2 ml-4 space-y-2 border-l pl-3">
      {items.map((sub: any, j: number) => (
        <li key={j}>
          <CMSLink
            {...sub.link}
            appearance="inline"
            className="text-sm opacity-80 hover:opacity-100 hover:text-sky-400 transition-colors"
          />
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <div className="flex items-center gap-4 w-full">
        {/* Desktop nav (centered by parent container) */}
        <nav className="hidden lg:flex gap-4 md:gap-12 items-center">
          {navItems.map((item, i) => {
            const { link, subNavItems } = item as any

            if (hasSubs(item)) {
              return (
                <div key={i} className="relative group">
                  <CMSLink {...link} appearance="link" className="text-md" />
                  <SubListDesktop items={subNavItems} />
                </div>
              )
            }

            return <CMSLink key={i} {...link} appearance="link" className="text-md" />
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="lg:hidden ml-auto h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-muted"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Mobile overlay nav */}
        {open && (
          <div
            id="mobile-nav"
            className="fixed inset-0 z-40 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/40 lg:hidden"
          >
            <div className="absolute inset-x-0 top-0 p-4 flex justify-end">
              <button
                type="button"
                className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-muted"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 pt-16 pb-8">
              <ul className="space-y-3 text-lg">
                {navItems.map((item, i) => {
                  const { link, subNavItems } = item as any

                  return (
                    <li key={i}>
                      <CMSLink
                        {...link}
                        appearance="inline"
                        className="font-medium hover:text-sky-400 transition-colors"
                      />
                      {hasSubs(item) && <SubListMobile items={subNavItems} />}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
