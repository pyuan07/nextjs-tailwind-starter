'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores'

interface AuthInitializerProps {
  children: React.ReactNode
}

/**
 * Auth initialization component that silently initializes auth state
 * without causing hydration mismatches
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
  useEffect(() => {
    // Initialize auth state after hydration
    useAuthStore
      .getState()
      .refreshAuth()
      .catch(err => {
        // Silent session refresh failure is expected on first visit
        // (no session cookie yet). Log only unexpected errors.
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthInitializer] Session refresh failed:', err)
        }
      })
  }, [])

  return <>{children}</>
}
