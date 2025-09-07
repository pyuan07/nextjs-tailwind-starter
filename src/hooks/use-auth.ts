import { useAuthStore } from '@/stores'

/**
 * Simplified auth hook - use this instead of multiple hooks
 */
export function useAuth() {
  return useAuthStore()
}

/**
 * Lightweight hook for checking auth status only
 */
export function useAuthStatus() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isLoading = useAuthStore(state => state.isLoading)
  return { isAuthenticated, isLoading }
}

/**
 * Convenience hooks for specific auth actions
 */
export function useLogin() {
  const login = useAuthStore(state => state.login)
  const isLoading = useAuthStore(state => state.isLoading)
  const error = useAuthStore(state => state.error)
  return { login, isLoading, error }
}

export function useLogout() {
  const logout = useAuthStore(state => state.logout)
  const isLoading = useAuthStore(state => state.isLoading)
  const error = useAuthStore(state => state.error)
  return { logout, isLoading, error }
}

export function useRegister() {
  const register = useAuthStore(state => state.register)
  const isLoading = useAuthStore(state => state.isLoading)
  const error = useAuthStore(state => state.error)
  return { register, isLoading, error }
}

export function useUpdateProfile() {
  const updateProfile = useAuthStore(state => state.updateProfile)
  const isLoading = useAuthStore(state => state.isLoading)
  const error = useAuthStore(state => state.error)
  return { updateProfile, isLoading, error }
}
