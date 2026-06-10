'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useAuthStatus } from '@/hooks'
import { ROUTES } from '@/constants'
import { matchesRoute } from '@/lib/route-matching'
import { Skeleton } from '@/components/ui'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({
  children,
  redirectTo = '/login',
  fallback,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStatus()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('auth.errors')

  const isProtectedRoute = matchesRoute(pathname, ROUTES.PROTECTED)
  const isAuthRoute = matchesRoute(pathname, ROUTES.AUTH)

  useEffect(() => {
    if (isLoading) return

    if (isProtectedRoute && !isAuthenticated) {
      router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    if (isAuthRoute && isAuthenticated) {
      router.push(ROUTES.DEFAULT_AUTHENTICATED)
      return
    }
  }, [
    isAuthenticated,
    isLoading,
    isProtectedRoute,
    isAuthRoute,
    pathname,
    router,
    redirectTo,
  ])

  if (isLoading) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center'>
          <div className='space-y-4 w-full max-w-md'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-32 w-full' />
            <Skeleton className='h-8 w-3/4' />
          </div>
        </div>
      )
    )
  }

  if (isProtectedRoute && !isAuthenticated) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <p className='text-muted-foreground'>{t('redirectingToLogin')}</p>
          </div>
        </div>
      )
    )
  }

  if (isAuthRoute && isAuthenticated) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <p className='text-muted-foreground'>{t('redirecting')}</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
