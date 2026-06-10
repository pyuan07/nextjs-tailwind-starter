/**
 * POST /api/auth/refresh
 *
 * Consumes the HttpOnly refresh_token cookie and issues a new access token
 * plus a rotated refresh token (token rotation prevents replay attacks).
 *
 * The auth_persist cookie is re-read here so the "remember me" preference
 * survives token rotation — without this, rotated cookies would become
 * session cookies after the first 15-minute refresh.
 *
 * On failure the response clears all auth cookies so the client is forced
 * back to the login page.
 */

import { NextResponse } from 'next/server'
import {
  setAuthCookies,
  setAuthPersistCookie,
  setCsrfCookie,
  clearAuthCookies,
  generateCsrfToken,
  parseCookieValue,
} from '@/lib/auth-cookies'
import { signAccessToken, decodeAccessToken } from '@/lib/jwt'
import type { ServiceResponse, TokenPair } from '@/types/api'
import {
  USE_REAL_API_SERVER,
  DEMO_CONFIG,
  TOKEN_CONFIG,
} from '@/constants/config'

function errorResponse(message: string, status: number): NextResponse {
  const resp = NextResponse.json(
    {
      success: false,
      message,
      errors: [message],
    } satisfies ServiceResponse<never>,
    { status }
  )
  clearAuthCookies(resp)
  return resp
}

export async function POST(request: Request): Promise<NextResponse> {
  // ── CSRF double-submit validation ─────────────────────────────────────────
  // Both the header AND a matching cookie are required (same strictness as login).
  const cookieHeader = request.headers.get('cookie') ?? ''
  const existingCsrf = parseCookieValue(cookieHeader, 'csrf_token')
  const headerCsrf = request.headers.get('x-csrf-token')

  if (!headerCsrf || !existingCsrf || existingCsrf !== headerCsrf) {
    return errorResponse('CSRF token required', 403)
  }

  // ── Read tokens from HttpOnly cookies ───────────────────────────────────
  const refreshToken = parseCookieValue(cookieHeader, 'refresh_token')
  const oldAccessToken = parseCookieValue(cookieHeader, 'auth_token')

  if (!refreshToken) {
    return errorResponse('No refresh token', 401)
  }

  // ── Read "remember me" preference to re-apply after rotation ─────────────
  const remember = parseCookieValue(cookieHeader, 'auth_persist') === '1'

  // ── Validate and rotate ──────────────────────────────────────────────────
  let newTokens: TokenPair

  try {
    if (USE_REAL_API_SERVER) {
      newTokens = await refreshViaRealApi(refreshToken)
    } else {
      newTokens = await refreshViaMock(refreshToken, oldAccessToken)
    }
  } catch (err) {
    console.error('[auth] refresh failed:', err)
    return errorResponse('Token refresh failed', 401)
  }

  // ── Issue new cookies — restore remember-me persistence ──────────────────
  const csrfToken = generateCsrfToken()

  const response = NextResponse.json(
    {
      success: true,
      message: 'Token refreshed successfully',
      data: { tokens: newTokens },
    } satisfies ServiceResponse<{ tokens: TokenPair }>,
    { status: 200 }
  )

  setAuthCookies(
    response,
    newTokens.accessToken,
    newTokens.refreshToken,
    remember
  )
  setAuthPersistCookie(response, remember)
  setCsrfCookie(response, csrfToken)

  return response
}

// ── Token refresh implementations ────────────────────────────────────────────

async function refreshViaMock(
  currentRefreshToken: string,
  oldAccessToken: string | null
): Promise<TokenPair> {
  if (!currentRefreshToken) throw new Error('Invalid refresh token')

  // Validate refresh token expiry — format: mock_refresh_<issuedAtMs>_<id>
  const parts = currentRefreshToken.split('_')
  if (parts.length >= 3) {
    const issuedAt = parseInt(parts[2] ?? '', 10)
    if (
      !isNaN(issuedAt) &&
      Date.now() > issuedAt + TOKEN_CONFIG.REFRESH_TOKEN_LIFETIME
    ) {
      throw new Error('Refresh token expired')
    }
  }

  // Extract user claims from the old (possibly expired) access token.
  // decodeAccessToken does NOT verify the signature — it only decodes.
  // This is intentional: the refresh token already proved the session is valid.
  const { DEMO_USER } = DEMO_CONFIG
  const fallbackClaims = {
    sub: String(DEMO_USER.id),
    email: DEMO_USER.email,
    name: DEMO_USER.name,
    role: DEMO_USER.role,
    lang: DEMO_USER.lang,
    isEmailVerified: DEMO_USER.isEmailVerified,
  }

  const claims =
    (oldAccessToken ? decodeAccessToken(oldAccessToken) : null) ??
    fallbackClaims

  const accessToken = await signAccessToken(claims)
  const now = Date.now()
  const randomId = crypto.randomUUID().replace(/-/g, '').substring(0, 13)

  return {
    accessToken,
    refreshToken: `mock_refresh_${now}_${randomId}`,
    accessTokenExpiry: now + TOKEN_CONFIG.ACCESS_TOKEN_LIFETIME,
    refreshTokenExpiry: now + TOKEN_CONFIG.REFRESH_TOKEN_LIFETIME,
    tokenType: 'Bearer',
  }
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
