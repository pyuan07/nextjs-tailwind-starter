'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores'
import { Skeleton } from '@/components/ui'

interface AuthInitializerProps {
  children: React.ReactNode
}

/**
 * Auth initialization component that ensures proper auth state setup
 * before rendering protected content
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
  const [hasInitialized, setHasInitialized] = useState(false)
  const [_initTimeout, setInitTimeout] = useState(false)

  useEffect(() => {
    // Set timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setInitTimeout(true)
      setHasInitialized(true)
    }, 3000) // Max 3 seconds loading

    const initialize = async () => {
      try {
        await useAuthStore.getState().refreshAuth()
      } catch (_error) {
        // Silent fail - let the app continue
      } finally {
        clearTimeout(timeout)
        setHasInitialized(true)
      }
    }

    initialize()

    return () => clearTimeout(timeout)
  }, [])

  // Show loading for maximum 3 seconds, then always render children
  if (!hasInitialized) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='space-y-4 w-full max-w-md'>
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-32 w-full' />
          <Skeleton className='h-8 w-3/4' />
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
