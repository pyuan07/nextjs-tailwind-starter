'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, X, Home, Eye, User } from 'lucide-react'
import { useAuth } from '@/hooks'

interface MobileNavProps {
  brandName: string
}

export function MobileNav({ brandName }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('common.navigation')
  const { isAuthenticated, logout } = useAuth()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  const toggleNav = () => setIsOpen(prev => !prev)
  const closeNav = () => setIsOpen(false)

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNav()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus management: move focus into drawer when opened
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
    } else {
      toggleButtonRef.current?.focus()
    }
  }, [isOpen])

  const navigationItems = [
    {
      href: '/',
      label: t('home'),
      icon: Home,
      public: true,
    },
    {
      href: '/showcase',
      label: t('showcase'),
      icon: Eye,
      public: false,
    },
    {
      href: '/profile',
      label: t('profile'),
      icon: User,
      public: false,
    },
  ]

  const visibleItems = navigationItems.filter(
    item => item.public || isAuthenticated
  )

  return (
    <>
      {/* Mobile Header */}
      <div className='flex md:hidden items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur'>
        {/* Brand */}
        <Link href='/' className='text-lg font-bold' onClick={closeNav}>
          {brandName}
        </Link>

        {/* Hamburger Button - Minimum 44px touch target */}
        <Button
          ref={toggleButtonRef}
          variant='ghost'
          size='touch'
          onClick={toggleNav}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls='mobile-navigation'
        >
          {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        </Button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 bg-black/50 z-40 md:hidden'
            onClick={closeNav}
            aria-hidden='true'
          />

          {/* Navigation Drawer */}
          <nav
            id='mobile-navigation'
            role='dialog'
            aria-modal='true'
            aria-label='Navigation menu'
            className={cn(
              'fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-background border-l z-50 md:hidden',
              'transform transition-transform duration-300 ease-in-out',
              isOpen ? 'translate-x-0' : 'translate-x-full'
            )}
          >
            {/* Header */}
            <div className='flex items-center justify-between h-16 px-4 border-b'>
              <span className='text-lg font-semibold'>{t('menu')}</span>
              <Button
                ref={closeButtonRef}
                variant='ghost'
                size='touch'
                onClick={closeNav}
                aria-label='Close menu'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>

            {/* Navigation Items */}
            <div className='p-4 space-y-2'>
              {visibleItems.map(item => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeNav}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg text-base transition-colors',
                      'min-h-11', // Minimum touch target
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className='h-5 w-5' />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Auth Section */}
            <div className='absolute bottom-0 left-0 right-0 p-4 border-t bg-muted/50'>
              {isAuthenticated ? (
                <div className='space-y-2'>
                  <Link
                    href='/profile'
                    onClick={closeNav}
                    className='flex items-center gap-3 p-3 rounded-lg text-base hover:bg-accent hover:text-accent-foreground min-h-11'
                  >
                    <User className='h-5 w-5' />
                    {t('profile')}
                  </Link>
                  <Button
                    variant='outline'
                    size='touch'
                    className='w-full'
                    onClick={async () => {
                      closeNav()
                      try {
                        await logout()
                        // Redirect to login page with locale preservation
                        setTimeout(() => {
                          router.push('/login')
                        }, 100)
                      } catch (error) {
                        console.warn('Logout failed:', error)
                      }
                    }}
                  >
                    {t('logout')}
                  </Button>
                </div>
              ) : (
                <div className='space-y-2'>
                  <Link href='/login' onClick={closeNav}>
                    <Button size='touch' className='w-full'>
                      {t('login')}
                    </Button>
                  </Link>
                  <Link href='/register' onClick={closeNav}>
                    <Button variant='outline' size='touch' className='w-full'>
                      {t('register')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </>
      )}
    </>
  )
}
