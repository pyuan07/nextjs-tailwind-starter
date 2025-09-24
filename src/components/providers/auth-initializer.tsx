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
      .catch(() => {
        // Silent fail - let the app continue
      })
  }, [])

  return <>{children}</>
}
