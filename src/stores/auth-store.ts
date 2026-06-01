import { create } from 'zustand'
import { authService } from '@/services'
import { tokenManager } from '@/utils/auth/tokenManager'
import { getErrorMessage } from '@/utils/helpers'
import type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
} from '@/types/api'

// Deduplication guard: prevents concurrent refreshAuth calls
let refreshPromise: Promise<void> | null = null

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: UpdateUserRequest) => Promise<User>
  clearError: () => void
  refreshAuth: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(set => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Actions
  clearError: () => {
    set({ error: null })
  },

  /**
   * Restore session from the HttpOnly cookie via GET /api/auth/session.
   * Deduplicates concurrent calls so app-boot and route changes never
   * race each other into issuing duplicate session requests.
   */
  refreshAuth: async () => {
    if (refreshPromise) {
      return refreshPromise
    }

    refreshPromise = (async () => {
      try {
        set({ isLoading: true, error: null })

        // initSession() calls GET /api/auth/session and updates the
        // in-memory currentUser cache. It catches internally and never throws.
        await tokenManager.initSession()

        const user = tokenManager.getUser()

        if (user !== null) {
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      } catch (err) {
        // Safety net: initSession() should never throw, but handle defensively.
        const errorMessage = getErrorMessage(err)
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: errorMessage,
        })
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  },

  /**
   * Login via POST /api/auth/login (sets HttpOnly cookies).
   * tokenManager.login() returns the server-authoritative User directly.
   */
  login: async (credentials: LoginRequest) => {
    try {
      set({ isLoading: true, error: null })

      const user = await tokenManager.login(credentials)

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  /**
   * Register via the mock/real authService, then establish an HttpOnly
   * session cookie by calling tokenManager.login() so the cookie-based
   * auth flow is connected from the moment of registration.
   */
  register: async (userData: RegisterRequest) => {
    try {
      set({ isLoading: true, error: null })

      // Step 1: create the account (mock or real API)
      const response = await authService.register(userData)

      if (!response.success) {
        throw new Error(response.message || 'Registration failed')
      }

      // Step 2: log in via the HttpOnly cookie route to establish the session
      const user = await tokenManager.login({
        email: userData.email,
        password: userData.password,
      })

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  /**
   * Logout via POST /api/auth/logout (clears HttpOnly cookies).
   */
  logout: async () => {
    try {
      set({ isLoading: true, error: null })

      await tokenManager.logout()

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })

      // Notify other tabs that this session has been invalidated
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth:logout', Date.now().toString())
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },

  updateProfile: async (updates: UpdateUserRequest): Promise<User> => {
    try {
      set({ isLoading: true, error: null })

      const response = await authService.updateProfile(updates)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Update failed')
      }

      set({ user: response.data, isLoading: false })

      return response.data
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      set({ error: errorMessage, isLoading: false })
      throw err
    }
  },
}))

// Cross-tab logout: 'storage' event propagates to other tabs; CustomEvent does not.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event: StorageEvent) => {
    if (event.key === 'auth:logout') {
      void useAuthStore
        .getState()
        .refreshAuth()
        .catch(() => {})
    }
  })
}
