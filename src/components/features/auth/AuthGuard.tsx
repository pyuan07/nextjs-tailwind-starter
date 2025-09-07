'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStatus } from '@/hooks'
import { tokenManager } from '@/utils/auth/tokenManager'
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
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const [forceComplete, setForceComplete] = useState(false)

  // Timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setForceComplete(true)
      setHasChecked(true)
    }, 2000) // Max 2 seconds for AuthGuard

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    // Reset redirect state when loading starts
    if (isLoading) {
      setHasChecked(false)
      setShouldRedirect(false)
      return
    }

    // Only check after loading is complete and we haven't checked yet
    if (!isLoading && !hasChecked) {
      // Small delay to ensure auth state is fully synchronized
      const timer = setTimeout(() => {
        // Double-check with token manager for most accurate state
        const hasValidTokens = tokenManager.isAuthenticated()
        const isLoggedIn = isAuthenticated || hasValidTokens

        if (!isLoggedIn) {
          setShouldRedirect(true)
        } else {
          setShouldRedirect(false)
        }

        setHasChecked(true)
      }, 150) // Slightly longer delay

      return () => clearTimeout(timer)
    }
  }, [isLoading, isAuthenticated, hasChecked])

  useEffect(() => {
    if (shouldRedirect) {
      const currentPath = window.location.pathname
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
      router.push(redirectUrl)
    }
  }, [shouldRedirect, redirectTo, router])

  // Show loading state while auth is being determined (but not forever)
  if ((isLoading || !hasChecked) && !forceComplete) {
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

  // Show redirecting state while redirecting
  if (shouldRedirect) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <p className='text-muted-foreground'>Redirecting to login...</p>
          </div>
        </div>
      )
    )
  }

  // Show content if authenticated
  const hasValidTokens = tokenManager.isAuthenticated()
  if (isAuthenticated || hasValidTokens) {
    return <>{children}</>
  }

  // Fallback - shouldn't reach here, but safety net
  return (
    fallback || (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-muted-foreground'>Redirecting to login...</p>
        </div>
      </div>
    )
  )
}
