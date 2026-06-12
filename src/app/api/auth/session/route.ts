/**
 * GET /api/auth/session
 *
 * Reads the HttpOnly auth_token cookie and returns the authenticated user.
 * This is the single source of truth for "am I logged in?" on the client side.
 *
 * Self-healing refresh:
 *   The access token lives for only 15 minutes, but the refresh token is valid
 *   for 7 days. When the access token is missing or expired BUT a valid refresh
 *   token is present, this endpoint silently rotates the token pair and sets
 *   fresh cookies — so a user is never logged out mid-session just because the
 *   short-lived access token lapsed. Without this, the app would appear to log
 *   the user out 15 minutes after login even with "remember me" checked.
 *
 *   Rotation here is driven entirely by HttpOnly cookies (no request body), so
 *   it does not require the CSRF double-submit check that POST /refresh enforces.
 *   The csrf_token cookie is intentionally left untouched so the client's
 *   in-memory CSRF token stays valid.
 */

import { NextResponse } from 'next/server'
import {
  setAuthCookies,
  setAuthPersistCookie,
  clearAuthCookies,
  parseCookieValue,
} from '@/lib/auth-cookies'
import { verifyAccessToken, type UserClaims } from '@/lib/jwt'
import { rotateTokens } from '@/lib/auth-rotation'
import type { ServiceResponse, User, TokenPair } from '@/types/api'
import { USE_REAL_API_SERVER } from '@/constants/config'

function unauthorizedResponse(message: string): NextResponse {
  const resp = NextResponse.json(
    {
      success: false,
      message,
      errors: [message],
    } satisfies ServiceResponse<never>,
    { status: 401 }
  )
  clearAuthCookies(resp)
  return resp
}

export async function GET(request: Request): Promise<NextResponse> {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const authToken = parseCookieValue(cookieHeader, 'auth_token')
  const refreshToken = parseCookieValue(cookieHeader, 'refresh_token')

  if (!authToken && !refreshToken) {
    return unauthorizedResponse('Not authenticated')
  }

  // ── Try the existing access token first ───────────────────────────────────
  let claims: UserClaims | null = authToken
    ? await verifyAccessToken(authToken)
    : null
  let rotated: TokenPair | null = null

  // ── Self-heal: access token gone/expired but refresh token still present ──
  if (!claims && refreshToken) {
    try {
      rotated = await rotateTokens(refreshToken, authToken, USE_REAL_API_SERVER)
      claims = await verifyAccessToken(rotated.accessToken)
    } catch (err) {
      console.error('[auth] session self-heal refresh failed:', err)
      rotated = null
      claims = null
    }
  }

  if (!claims) {
    return unauthorizedResponse('Session invalid')
  }

  // ── Resolve the user ──────────────────────────────────────────────────────
  let user: User
  try {
    if (USE_REAL_API_SERVER) {
      const bearer = rotated?.accessToken ?? authToken ?? ''
      user = await validateViaRealApi(bearer)
    } else {
      user = claimsToUser(claims)
    }
  } catch (err) {
    console.error('[auth] session validation failed:', err)
    return unauthorizedResponse('Session invalid')
  }

  const response = NextResponse.json(
    {
      success: true,
      message: 'Session valid',
      data: { user },
    } satisfies ServiceResponse<{ user: User }>,
    { status: 200 }
  )

  // ── Persist rotated cookies (CSRF left untouched — see file header) ───────
  if (rotated) {
    const remember = parseCookieValue(cookieHeader, 'auth_persist') === '1'
    setAuthCookies(
      response,
      rotated.accessToken,
      rotated.refreshToken,
      remember
    )
    setAuthPersistCookie(response, remember)
  }

  return response
}

// ── Validation implementations ────────────────────────────────────────────────

function claimsToUser(claims: UserClaims): User {
  return {
    id: claims.sub,
    email: claims.email,
    name: claims.name,
    role: claims.role,
    lang: claims.lang,
    isEmailVerified: claims.isEmailVerified,
    avatar: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

async function validateViaRealApi(token: string): Promise<User> {
  const { api } = await import('@/lib/api')
  const { API_ENDPOINTS } = await import('@/types/api')

  const response = await api.get<{ user: User }>(API_ENDPOINTS.users.profile, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.user
}
