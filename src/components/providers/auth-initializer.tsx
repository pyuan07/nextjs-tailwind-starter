'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores'
import { getLocaleFromPathname } from '@/lib/locale'

interface AuthInitializerProps {
  children: React.ReactNode
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  useEffect(() => {
    // Restore session from the HttpOnly cookie on first mount
    useAuthStore
      .getState()
      .refreshAuth()
      .catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthInitializer] Session refresh failed:', err)
        }
      })

    // Cross-tab logout: when another tab calls logout it writes to localStorage;
    // this tab picks up the storage event and clears its own auth state.
    function handleStorageEvent(event: StorageEvent) {
      if (event.key === 'auth:logout') {
        void useAuthStore
          .getState()
          .refreshAuth()
          .catch(() => {})
      }
    }

    // Session expired (e.g. refresh token rotated out): redirect to login.
    function handleSessionExpired() {
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
      const locale = getLocaleFromPathname(window.location.pathname)
      window.location.href = `/${locale}/login`
    }

    window.addEventListener('storage', handleStorageEvent)
    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => {
      window.removeEventListener('storage', handleStorageEvent)
      window.removeEventListener('auth:session-expired', handleSessionExpired)
    }
  }, [])

  return <>{children}</>
}
