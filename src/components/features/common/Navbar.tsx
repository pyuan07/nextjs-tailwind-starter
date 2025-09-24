'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/contexts/LanguageContext'
import { ThemeToggle } from '@/components/features'
import { LanguageSwitcher } from '@/components/features/language/LanguageSwitcher'
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
    <div className='flex items-center gap-4'>
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
  const t = useTranslation()

  return (
    <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-6'>
          <Link href='/' className='text-xl font-bold'>
            Backoffice Starter
          </Link>

          {/* Navigation Menu */}
          <NavigationMenu className='hidden md:flex'>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href='/' legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === '/' && 'bg-accent text-accent-foreground'
                    )}
                  >
                    {t('nav.home')}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <AuthNavLinks />
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side actions */}
        <div className='flex items-center gap-4'>
          <LanguageSwitcher variant='select' size='sm' />
          <ThemeToggle />
          <AuthNavActions />
        </div>
      </div>
    </header>
  )
}
