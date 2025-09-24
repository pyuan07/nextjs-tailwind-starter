'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

export function ConditionalNavbar() {
  const pathname = usePathname()

  // Don't show navbar on auth pages (they have their own header)
  // Handle both locale-prefixed and non-prefixed paths
  const isAuthPage =
    pathname.includes('/login') ||
    pathname.includes('/register') ||
    pathname.includes('/forgot-password')

  if (isAuthPage) {
    return null
  }

  return <Navbar />
}
