/**
 * POST /api/auth/refresh
 *
 * Consumes the HttpOnly refresh_token cookie and issues a new access token
 * plus a rotated refresh token (token rotation prevents replay attacks).
 *
 * This endpoint is scoped to Path=/api/auth/refresh in the refresh_token
 * cookie, so the browser only sends the refresh token to this exact path.
 *
 * On failure the response clears all auth cookies so the client is forced
 * back to the login page.
 */

import { NextResponse } from 'next/server'
import { MockAuthService } from '@/services/mock-auth.service'
import {
  setAuthCookies,
  setCsrfCookie,
  clearAuthCookies,
  generateCsrfToken,
  parseCookieValue,
} from '@/lib/auth-cookies'
import type { ServiceResponse, TokenPair } from '@/types/api'
import { USE_REAL_API_SERVER } from '@/constants/config'

function errorResponse(message: string, status: number): NextResponse {
  const resp = NextResponse.json(
    {
      success: false,
      message,
      errors: [message],
    } satisfies ServiceResponse<never>,
    { status }
  )
  // Clear stale cookies so the client is fully logged out
  clearAuthCookies(resp)
  return resp
}

export async function POST(request: Request): Promise<NextResponse> {
  // ── CSRF double-submit validation ────────────────────────────────────────
  const cookieHeader = request.headers.get('cookie') ?? ''
  const existingCsrf = parseCookieValue(cookieHeader, 'csrf_token')
  const headerCsrf = request.headers.get('x-csrf-token')

  if (!headerCsrf || (existingCsrf && existingCsrf !== headerCsrf)) {
    return errorResponse('CSRF token required', 403)
  }

  // ── Read refresh token from HttpOnly cookie ───────────────────────────────
  const refreshToken = parseCookieValue(cookieHeader, 'refresh_token')

  if (!refreshToken) {
    return errorResponse('No refresh token', 401)
  }

  // ── Validate and rotate ──────────────────────────────────────────────────
  let newTokens: TokenPair

  try {
    if (USE_REAL_API_SERVER) {
      newTokens = await refreshViaRealApi(refreshToken)
    } else {
      newTokens = await refreshViaMock(refreshToken)
    }
  } catch (err) {
    console.error('[auth] refresh failed:', err)
    return errorResponse('Token refresh failed', 401)
  }

  // ── Issue new cookies ────────────────────────────────────────────────────
  const csrfToken = generateCsrfToken()

  const response = NextResponse.json(
    {
      success: true,
      message: 'Token refreshed successfully',
      data: { tokens: newTokens },
    } satisfies ServiceResponse<{ tokens: TokenPair }>,
    { status: 200 }
  )

  setAuthCookies(response, newTokens.accessToken, newTokens.refreshToken)
  setCsrfCookie(response, csrfToken)

  return response
}

// ── Token refresh implementations ────────────────────────────────────────────

async function refreshViaMock(currentRefreshToken: string): Promise<TokenPair> {
  // Validate the mock token is non-empty and structurally looks like a mock token
  if (!currentRefreshToken || currentRefreshToken.length === 0) {
    throw new Error('Invalid refresh token')
  }

  // Extract expiry from the mock token format: mock_refresh_<timestamp>_<id>
  // If the token has an encoded expiry that has passed, reject it
  const parts = currentRefreshToken.split('_')
  if (parts.length >= 3) {
    const timestampStr = parts[2] ?? ''
    const issuedAt = parseInt(timestampStr, 10)
    if (!isNaN(issuedAt)) {
      const REFRESH_TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000
      if (Date.now() > issuedAt + REFRESH_TOKEN_LIFETIME_MS) {
        throw new Error('Refresh token expired')
      }
    }
  }

  const result = await MockAuthService.refreshToken()
  if (!result.success) {
    throw new Error(result.message)
  }
  return result.data.tokens
}

async function refreshViaRealApi(refreshToken: string): Promise<TokenPair> {
  const { api } = await import('@/lib/api')
  const { API_ENDPOINTS } = await import('@/types/api')

  const response = await api.post<{
    access: { token: string; expires: string }
    refresh: { token: string; expires: string }
  }>(API_ENDPOINTS.auth.refresh, { refreshToken })

  return {
    accessToken: response.access.token,
    refreshToken: response.refresh.token,
    accessTokenExpiry: new Date(response.access.expires).getTime(),
    refreshTokenExpiry: new Date(response.refresh.expires).getTime(),
    tokenType: 'Bearer',
  }
}
