'use client'

import { memo } from 'react'
import { Link } from '@/i18n/navigation'
import { usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks'
import { UserDropdown } from '@/components/features'
import { Button } from '@/components/ui'
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

/**
 * Auth-dependent navigation links that go inside NavigationMenu
 */
export const AuthNavLinks = memo(function AuthNavLinks() {
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()
  const t = useTranslations('common.navigation')

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            href='/showcase'
            className={cn(
              navigationMenuTriggerStyle(),
              'min-h-11', // Touch-friendly height
              pathname === '/showcase' && 'bg-accent text-accent-foreground'
            )}
          >
            {t('showcase')}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            href='/profile'
            className={cn(
              navigationMenuTriggerStyle(),
              'min-h-11', // Touch-friendly height
              pathname === '/profile' && 'bg-accent text-accent-foreground'
            )}
          >
            {t('profile')}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  )
})

/**
 * Auth-dependent actions (buttons, dropdown) for the right side
 */
const AuthNavActions = memo(function AuthNavActions() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const t = useTranslations('common.navigation')

  if (isLoading) {
    return (
      <div className='flex items-center gap-4'>
        <div className='w-16 h-9 bg-muted animate-pulse rounded' />
        <div className='w-20 h-9 bg-muted animate-pulse rounded' />
      </div>
    )
  }

  return (
    <>
      {isAuthenticated && user ? (
        <UserDropdown user={user} />
      ) : (
        <div className='flex items-center gap-2'>
          <Link href='/login'>
            <Button variant='outline' size='sm' className='min-h-11'>
              {t('login')}
            </Button>
          </Link>
          <Link href='/register'>
            <Button size='sm' className='min-h-11'>
              {t('register')}
            </Button>
          </Link>
        </div>
      )}
    </>
  )
})

export default AuthNavActions
