// Single, centralized API client for external TypeScript API
import { apiConfig, buildApiUrl } from '@/config/api'
import { logger } from '@/lib/logger'
import { tokenManager } from '@/utils/auth/tokenManager'
import type { RequestConfig } from '@/types/api'

export class SessionExpiredError extends Error {
  constructor() {
    super('Session expired')
    this.name = 'SessionExpiredError'
  }
}

function dispatchSessionExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:session-expired'))
  }
}

// Custom error class for API errors
export class ApiError extends Error {
  public readonly statusCode: number
  public readonly response?: Response
  public readonly data?: unknown

  constructor(
    message: string,
    statusCode: number,
    response?: Response,
    data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    if (response !== undefined) this.response = response
    if (data !== undefined) this.data = data
  }
}

// Main API client class
class ApiClient {
  private baseURL: string
  private timeout: number

  constructor() {
    this.baseURL = apiConfig.baseURL
    this.timeout = apiConfig.timeout
  }

  // Build URL with query parameters
  private buildUrlWithParams(
    url: string,
    params?: Record<string, string | number | boolean>
  ): string {
    if (!params || Object.keys(params).length === 0) {
      return url
    }

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })

    return `${url}?${searchParams.toString()}`
  }

  // Create AbortController with timeout; returns the controller and a cancel fn to clear the timer.
  private createTimeoutController(timeout: number): {
    controller: AbortController
    cancel: () => void
  } {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    return { controller, cancel: () => clearTimeout(timer) }
  }

  // Delay function for retries
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Main request method
  async request<T = unknown>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      timeout = this.timeout,
      retries = apiConfig.retry.attempts,
      params,
      body,
      ...fetchConfig
    } = config

    // Build full URL
    const url = endpoint.startsWith('http') ? endpoint : buildApiUrl(endpoint)

    const urlWithParams = this.buildUrlWithParams(url, params)

    // Get auth token
    const token = await tokenManager.getValidAccessToken()

    // Prepare fetch configuration headers explicitly using the Headers constructor
    const headers = new Headers(apiConfig.headers)

    if (fetchConfig.headers) {
      const incomingHeaders = new Headers(fetchConfig.headers)
      incomingHeaders.forEach((value, key) => {
        headers.set(key, value)
      })
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const fetchOptions: RequestInit = {
      method: 'GET',
      headers,
      ...fetchConfig,
    }

    // Add body if present
    if (body !== undefined) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    let lastError: Error | undefined
    let attempt = 0

    while (attempt <= retries) {
      try {
        const startTime = Date.now()
        const { controller, cancel } = this.createTimeoutController(timeout)

        logger.info('API Request', {
          method: fetchOptions.method,
          url: urlWithParams,
          attempt: attempt + 1,
        })

        let response: Response
        try {
          response = await fetch(urlWithParams, {
            ...fetchOptions,
            signal: controller.signal,
          })
        } finally {
          cancel() // Always clear the timeout timer
        }
        const duration = Date.now() - startTime

        logger.info('API Response', {
          method: fetchOptions.method,
          url: urlWithParams,
          status: response.status,
          duration: `${duration}ms`,
          success: response.ok,
        })

        // Handle authentication errors with token refresh — one retry only.
        //
        // attempt === 0: first request returned 401 — attempt token refresh.
        // attempt > 0:   post-refresh retry returned 401 — session unrecoverable.
        if (response.status === 401 && attempt > 0) {
          logger.warn('401 on post-refresh retry — session expired')
          tokenManager.clearTokens()
          dispatchSessionExpired()
          throw new SessionExpiredError()
        }

        if (response.status === 401 && attempt === 0) {
          logger.warn('401 Unauthorized - attempting token refresh')

          try {
            const refreshed = await tokenManager.refresh()
            if (!refreshed) {
              throw new Error(
                'Token refresh returned false — refresh token may be expired'
              )
            }
            attempt++
            continue
          } catch (refreshError) {
            logger.error('Token refresh failed', refreshError as Error)
            tokenManager.clearTokens()
            dispatchSessionExpired()
            throw new SessionExpiredError()
          }
        }

        // Handle successful responses
        if (response.ok) {
          const contentType = response.headers.get('content-type')

          if (contentType?.includes('application/json')) {
            const data = await response.json()
            return data as T
          }

          return response.text() as unknown as T
        }

        // Handle error responses
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        let errorData: unknown

        try {
          const contentType = response.headers.get('content-type')
          if (contentType?.includes('application/json')) {
            errorData = await response.json()
            if (
              typeof errorData === 'object' &&
              errorData !== null &&
              'message' in errorData
            ) {
              errorMessage = (errorData as { message: string }).message
            }
          } else {
            errorData = await response.text()
            if (typeof errorData === 'string' && errorData.length > 0) {
              errorMessage = errorData
            }
          }
        } catch {
          // Use default error message if parsing fails
        }

        const apiError = new ApiError(
          errorMessage,
          response.status,
          response,
          errorData
        )

        // Don't retry client errors (4xx).
        // 401s are handled above (refresh once, then throw) and never reach here.
        if (response.status >= 400 && response.status < 500) {
          throw apiError
        }

        lastError = apiError
      } catch (error) {
        // Non-retryable errors must propagate immediately. They are thrown from
        // inside this same try block, so without an explicit rethrow they get
        // swallowed here and the request is retried anyway — turning a 400 into
        // N pointless round trips and re-firing `auth:session-expired` each pass.
        if (error instanceof SessionExpiredError) {
          throw error
        }
        if (
          error instanceof ApiError &&
          error.statusCode >= 400 &&
          error.statusCode < 500
        ) {
          throw error
        }

        lastError = error instanceof Error ? error : new Error(String(error))

        if (error instanceof Error && error.name === 'AbortError') {
          logger.error('Request timeout', error, {
            url: urlWithParams,
            timeout,
          })
        }
      }

      // Wait before retry (exponential backoff)
      if (attempt < retries) {
        const delay =
          apiConfig.retry.delay * Math.pow(apiConfig.retry.backoff, attempt)
        await this.delay(delay)
      }

      attempt++
    }

    const finalError = lastError || new Error('All retry attempts exhausted')
    logger.error('All retry attempts exhausted', finalError, {
      url: urlWithParams,
    })
    throw finalError
  }

  // HTTP method helpers
  async get<T = unknown>(
    endpoint: string,
    config: Omit<RequestConfig, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body })
  }

  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body })
  }

  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body })
  }

  async delete<T = unknown>(
    endpoint: string,
    config: Omit<RequestConfig, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get('/health')
  }
}

// Create and export singleton instance
export const api = new ApiClient()

// Export for advanced usage
export { ApiClient }

// Default export
export default api
