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
  csrfTokensMatch,
} from '@/lib/auth-cookies'
import { rotateTokens } from '@/lib/auth-rotation'
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
  clearAuthCookies(resp)
  return resp
}

export async function POST(request: Request): Promise<NextResponse> {
  // ── CSRF double-submit validation ─────────────────────────────────────────
  // Both the header AND a matching cookie are required (same strictness as login).
  const cookieHeader = request.headers.get('cookie') ?? ''
  const existingCsrf = parseCookieValue(cookieHeader, 'csrf_token')
  const headerCsrf = request.headers.get('x-csrf-token')

  if (!csrfTokensMatch(existingCsrf, headerCsrf)) {
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
    newTokens = await rotateTokens(
      refreshToken,
      oldAccessToken,
      USE_REAL_API_SERVER
    )
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
