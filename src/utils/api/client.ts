// Industry-standard API client with secure token management and auto-refresh
import { env } from '@/config/env'
import { logger } from '@/lib/logger'
import { tokenManager } from '@/utils/auth/tokenManager'

const API_BASE_URL = env.API_BASE_URL

// Request retry configuration
const MAX_RETRY_ATTEMPTS = 1
const RETRY_DELAY = 1000

// Enhanced API client with auto-refresh
export const api = {
  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE_URL}${endpoint}`
    const startTime = Date.now()

    try {
      // Get valid access token (auto-refreshes if needed)
      const token = await tokenManager.getValidAccessToken()

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      })

      const duration = Date.now() - startTime
      logger.info('API call completed', {
        endpoint,
        duration: `${duration}ms`,
        success: response.ok,
      })

      // Handle authentication errors with retry logic
      if (response.status === 401 && retryCount < MAX_RETRY_ATTEMPTS) {
        logger.warn('401 Unauthorized - attempting token refresh and retry')

        try {
          // Force token refresh
          await tokenManager.refreshAccessToken()

          // Retry the request with new token
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
          return api.request<T>(endpoint, options, retryCount + 1)
        } catch (refreshError) {
          logger.error(
            'Token refresh failed during retry',
            refreshError as Error
          )

          // Clear invalid tokens and redirect to login
          tokenManager.clearTokens()

          if (
            typeof window !== 'undefined' &&
            !window.location.pathname.includes('/login')
          ) {
            window.location.href = '/login'
          }
        }
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Request failed')

        // Final 401 handling (after retry attempts)
        if (response.status === 401) {
          logger.warn('Authentication failed after retry - clearing tokens')
          tokenManager.clearTokens()

          if (
            typeof window !== 'undefined' &&
            !window.location.pathname.includes('/login')
          ) {
            window.location.href = '/login'
          }
        }

        const error = new Error(errorText) as any
        error.status = response.status
        throw error
      }

      return response.json()
    } catch (error) {
      const duration = Date.now() - startTime
      logger.error('API call failed', {
        endpoint,
        duration: `${duration}ms`,
        error: error.message,
      })
      throw error
    }
  },

  get: <T = unknown>(endpoint: string) => api.request<T>(endpoint),

  post: <T = unknown>(endpoint: string, data?: unknown) =>
    api.request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),

  put: <T = unknown>(endpoint: string, data?: unknown) =>
    api.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),

  patch: <T = unknown>(endpoint: string, data?: unknown) =>
    api.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: <T = unknown>(endpoint: string) =>
    api.request<T>(endpoint, { method: 'DELETE' }),
}

// Centralized auth utilities (backward compatibility)
export const auth = {
  // Legacy method - use tokenManager.storeTokens() for new token pairs
  setToken: (token: string) => {
    // For backward compatibility, create a simple token pair
    const now = Date.now()
    const mockTokenPair = {
      accessToken: token,
      refreshToken: '', // Legacy calls don't have refresh tokens
      accessTokenExpiry: now + 30 * 60 * 1000, // 30 minutes
      refreshTokenExpiry: now + 7 * 24 * 60 * 60 * 1000, // 7 days
      tokenType: 'Bearer' as const,
    }
    tokenManager.storeTokens(mockTokenPair)
  },
  getToken: () => tokenManager.getCurrentAccessToken(),
  clearToken: () => tokenManager.clearTokens(),
  isAuthenticated: () => tokenManager.isAuthenticated(),
}

// Export for backward compatibility
export const apiClient = api
export default api
