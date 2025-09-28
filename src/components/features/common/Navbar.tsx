'use client'

import dynamic from 'next/dynamic'
import { usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from '@/components/features'
import { LocaleSwitcher } from '@/components/features/i18n/LocaleSwitcher'
import { MobileNav } from './MobileNav'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

// Dynamically import auth-dependent components to prevent hydration issues
const AuthNavActions = dynamic(() => import('./AuthNavSection'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center gap-2'>
      <div className='w-16 h-9 bg-muted animate-pulse rounded' />
      <div className='w-20 h-9 bg-muted animate-pulse rounded' />
    </div>
  ),
})

const AuthNavLinks = dynamic(
  () => import('./AuthNavSection').then(mod => ({ default: mod.AuthNavLinks })),
  {
    ssr: false,
    loading: () => null,
  }
)

export function Navbar() {
  const pathname = usePathname()
  const t = useTranslations('common.navigation')
  const tCommon = useTranslations('common')
  const brandName = tCommon('brand.name')

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNav brandName={brandName} />

      {/* Desktop Navigation */}
      <header className='hidden md:block border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-6'>
            <Link href='/' className='text-xl font-bold'>
              {brandName}
            </Link>

            {/* Desktop Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href='/'
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'min-h-11', // Touch-friendly height
                        pathname === '/' && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {t('home')}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <AuthNavLinks />
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Right side actions */}
          <div className='flex items-center gap-3'>
            <LocaleSwitcher variant='select' size='sm' />
            <ThemeToggle />
            <AuthNavActions />
          </div>
        </div>
      </header>
    </>
  )
}
