/**
 * Client-side token manager - server-side auth edition.
 *
 * All auth tokens now live exclusively in HttpOnly cookies managed by the
 * /api/auth/* route handlers. This module provides the client-facing API
 * that the rest of the application (services, stores, API client) calls.
 * It never reads or writes auth tokens directly; it delegates to the
 * API routes and keeps only a lightweight in-memory user cache.
 *
 * Legacy shims retained for compatibility with auth.service.ts and
 * mock-auth.service.ts (storeTokens, clearTokens, getRefreshTokenFromCookie).
 * These are no-ops or delegates - the actual token storage is server-side.
 */

import { logger } from '@/lib/logger'
import { TOKEN_CONFIG } from '@/constants'
import type {
  LoginRequest,
  User,
  TokenPair,
  TokenValidation,
} from '@/types/api'

// In-memory state
let currentUser: User | null = null
let csrfToken: string | null = null
let refreshInFlight: Promise<boolean> | null = null
let sessionStartTime: number | null = null
const ACCESS_TOKEN_LIFETIME_MS = TOKEN_CONFIG.ACCESS_TOKEN_LIFETIME

function readCsrfCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf_token='))
  return match ? decodeURIComponent(match.split('=')[1] ?? '') : null
}

async function ensureCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken
  try {
    const response = await fetch('/api/auth/csrf', { method: 'GET' })
    if (!response.ok) {
      throw new Error('CSRF fetch failed: ' + String(response.status))
    }
    // Token is set as a JS-readable cookie by the server; read it from there.
    await response.json() // consume body
    const fromCookie = readCsrfCookie()
    if (!fromCookie) {
      throw new Error('CSRF cookie not set after fetch')
    }
    csrfToken = fromCookie
    return csrfToken
  } catch (err) {
    logger.error('Failed to fetch CSRF token', err as Error)
    // Don't cache a fallback — server won't recognize it
    throw new Error('Failed to establish CSRF token. Please reload the page.')
  }
}

function buildAuthHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-csrf-token': token,
  }
}

async function callLogin(credentials: LoginRequest): Promise<{ user: User }> {
  const token = await ensureCsrfToken()
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(credentials),
    credentials: 'same-origin',
  })
  const data = (await response.json()) as {
    success: boolean
    message: string
    data?: { user: User }
    errors?: string[]
  }
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Login failed')
  }
  if (!data.data) {
    throw new Error('Malformed login response')
  }
  return data.data
}

async function callLogout(): Promise<void> {
  const token = csrfToken ?? (await ensureCsrfToken())
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: buildAuthHeaders(token),
    credentials: 'same-origin',
  })
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      message?: string
    }
    throw new Error(data.message || 'Logout failed')
  }
}

async function callRefresh(): Promise<boolean> {
  const token = csrfToken ?? (await ensureCsrfToken())
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': token,
    },
    credentials: 'same-origin',
  })
  // Clear cached CSRF so ensureCsrfToken fetches a fresh one after token rotation
  csrfToken = null
  return response.ok
}

async function callSession(): Promise<User | null> {
  const response = await fetch('/api/auth/session', {
    method: 'GET',
    credentials: 'same-origin',
  })
  if (!response.ok) return null
  const data = (await response.json()) as {
    success: boolean
    data?: { user: User }
  }
  return data.success && data.data ? data.data.user : null
}

export class SecureTokenManager {
  private static instance: SecureTokenManager

  static getInstance(): SecureTokenManager {
    if (!SecureTokenManager.instance) {
      SecureTokenManager.instance = new SecureTokenManager()
    }
    return SecureTokenManager.instance
  }

  /**
   * Initialise session on app boot.
   * Calls /api/auth/session to restore in-memory state from the HttpOnly cookie.
   */
  async initSession(): Promise<void> {
    try {
      const user = await callSession()
      currentUser = user
      logger.info('Session initialised', { authenticated: user !== null })
    } catch (err) {
      logger.error('Failed to initialise session', err as Error)
      currentUser = null
    }
  }

  /**
   * Attempt to refresh the access token using the HttpOnly refresh_token cookie.
   * Returns true on success. Deduplicates concurrent calls.
   */
  async refresh(): Promise<boolean> {
    if (refreshInFlight) return refreshInFlight
    refreshInFlight = (async () => {
      try {
        const ok = await callRefresh()
        if (ok) {
          currentUser = await callSession()
        } else {
          currentUser = null
        }
        return ok
      } catch (err) {
        logger.error('Token refresh failed', err as Error)
        currentUser = null
        return false
      } finally {
        refreshInFlight = null
      }
    })()
    return refreshInFlight
  }

  /** Returns true when the in-memory user cache is populated. */
  isAuthenticated(): boolean {
    return currentUser !== null
  }

  /** Returns the cached user or null. */
  getUser(): User | null {
    return currentUser
  }

  // ── Legacy shims ─────────────────────────────────────────────────────────
  // These methods are called by auth.service.ts and mock-auth.service.ts.
  // They are kept as no-ops or thin delegates for backwards compatibility.

  /**
   * No-op shim: tokens are stored in HttpOnly cookies by the login route handler.
   */
  storeTokens(_tokens: TokenPair): void {
    logger.info(
      'storeTokens called - tokens are managed server-side via HttpOnly cookies'
    )
  }

  /** Clears in-memory auth state. HttpOnly cookies are cleared by /api/auth/logout. */
  clearTokens(): void {
    currentUser = null
    csrfToken = null
    sessionStartTime = null
    logger.info('In-memory auth state cleared')
  }

  /**
   * Shim: delegates to refresh(). Returns a stub TokenPair for callers that expect one.
   * // Tokens are stored in HttpOnly cookies; cannot be returned to JS callers. Future: change return type to Promise<null>.
   */
  async refreshAccessToken(): Promise<TokenPair | null> {
    const ok = await this.refresh()
    if (!ok) return null
    const now = Date.now()
    return {
      accessToken: '__httponly__',
      refreshToken: '__httponly__',
      accessTokenExpiry: now + TOKEN_CONFIG.ACCESS_TOKEN_LIFETIME,
      refreshTokenExpiry: now + TOKEN_CONFIG.REFRESH_TOKEN_LIFETIME,
      tokenType: 'Bearer',
    }
  }

  /** Shim: returns a TokenValidation based on current in-memory state. */
  validateAccessToken(): TokenValidation {
    if (currentUser === null) {
      return {
        isValid: false,
        isExpired: true,
        expiresIn: 0,
        needsRefresh: true,
      }
    }
    const elapsed =
      sessionStartTime !== null ? Date.now() - sessionStartTime : 0
    const remainingMs = Math.max(0, ACCESS_TOKEN_LIFETIME_MS - elapsed)
    const expiresIn = Math.floor(remainingMs / 1000)
    const isExpired = remainingMs === 0
    const needsRefresh = remainingMs <= 120 * 1000 // refresh when under 2 minutes remain
    return {
      isValid: !isExpired,
      isExpired,
      expiresIn,
      needsRefresh,
    }
  }

  /**
   * Shim: HttpOnly refresh token is not readable from JavaScript.
   * Returns null so authService.logout() skips server-side revocation.
   */
  getRefreshTokenFromCookie(): string | null {
    return null
  }

  /** Shim: access tokens are opaque to the client. */
  async getValidAccessToken(): Promise<string | null> {
    return null
  }

  /** Shim: returns null - use getUser() for the current user. */
  getCurrentAccessToken(): string | null {
    return null
  }

  // ── High-level login/logout ───────────────────────────────────────────────

  /**
   * Full login: POST /api/auth/login (sets HttpOnly cookies), then cache user.
   */
  async login(credentials: LoginRequest): Promise<User> {
    sessionStartTime = Date.now()
    const { user } = await callLogin(credentials)
    currentUser = user
    csrfToken = null
    return user
  }

  /**
   * Full logout: POST /api/auth/logout (clears HttpOnly cookies), then clear memory.
   */
  async logout(): Promise<void> {
    try {
      await callLogout()
    } finally {
      currentUser = null
      csrfToken = null
      sessionStartTime = null
    }
  }
}

// Singleton instance
export const tokenManager = SecureTokenManager.getInstance()
