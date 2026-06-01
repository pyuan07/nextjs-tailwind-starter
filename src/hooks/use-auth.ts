import { useShallow } from 'zustand/react/shallow'
import { useAuthStore } from '@/stores'

/**
 * Simplified auth hook - use this instead of multiple hooks
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    refreshAuth,
  } = useAuthStore(
    useShallow(state => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
      login: state.login,
      register: state.register,
      logout: state.logout,
      updateProfile: state.updateProfile,
      clearError: state.clearError,
      refreshAuth: state.refreshAuth,
    }))
  )

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    clearError,
    refreshAuth,
  }
}

/**
 * Lightweight hook for checking auth status only
 */
export function useAuthStatus() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isLoading = useAuthStore(state => state.isLoading)
  return { isAuthenticated, isLoading }
}

// NOTE: Use useAuth() instead of individual hooks above for simpler API
