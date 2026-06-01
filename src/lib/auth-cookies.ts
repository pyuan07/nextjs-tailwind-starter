/**
 * Server-side auth cookie helpers for Next.js route handlers.
 *
 * All auth tokens are set as HttpOnly cookies so they are never accessible
 * from JavaScript running in the browser. This eliminates XSS-based token theft.
 *
 * Cookie layout:
 *   auth_token    – short-lived access token  (HttpOnly; 15 min)
 *   refresh_token – long-lived refresh token  (HttpOnly; 7 days; Path=/api/auth/refresh)
 *   csrf_token    – CSRF nonce                (NOT HttpOnly; JS must read it; 15 min)
 */

import { NextResponse } from 'next/server'

// Cookie lifetimes in seconds
const ACCESS_TOKEN_MAX_AGE = 15 * 60 // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 // 7 days
const CSRF_TOKEN_MAX_AGE = 15 * 60 // 15 minutes

const isProduction = process.env.NODE_ENV === 'production'

/**
 * Attach auth cookies to an existing NextResponse and return it.
 * Mutates the response headers in place (NextResponse.cookies is a setter API).
 *
 * When `remember` is true the cookies persist across browser sessions using the
 * configured max-age values.  When false (or omitted) the maxAge property is
 * omitted entirely so the browser treats the cookies as session cookies that
 * expire when the browser closes.
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  remember?: boolean
): NextResponse {
  // Access token – read by middleware on the edge; never by JS
  response.cookies.set('auth_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    ...(remember ? { maxAge: ACCESS_TOKEN_MAX_AGE } : {}),
  })

  // Refresh token – only sent to the refresh endpoint
  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/api/auth/refresh',
    ...(remember ? { maxAge: REFRESH_TOKEN_MAX_AGE } : {}),
  })

  return response
}

/**
 * Set a JS-readable CSRF cookie.
 * The client must copy this value into the `x-csrf-token` request header.
 */
export function setCsrfCookie(
  response: NextResponse,
  csrfToken: string
): NextResponse {
  response.cookies.set('csrf_token', csrfToken, {
    httpOnly: false, // Must be JS-readable for the client to inject it as a header
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: CSRF_TOKEN_MAX_AGE,
  })

  return response
}

/**
 * Expire all three auth cookies by setting Max-Age=0.
 */
export function clearAuthCookies(response: NextResponse): NextResponse {
  const clearOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 0,
  }

  response.cookies.set('auth_token', '', clearOptions)
  response.cookies.set('refresh_token', '', {
    ...clearOptions,
    path: '/api/auth/refresh',
  })
  response.cookies.set('csrf_token', '', {
    ...clearOptions,
    httpOnly: false,
  })

  return response
}

/**
 * Generate a cryptographically random CSRF token.
 */
export function generateCsrfToken(): string {
  return crypto.randomUUID()
}

/**
 * Parse a single named cookie value from a raw Cookie header string.
 * Handles base64-encoded values that contain `=` padding correctly.
 */
export function parseCookieValue(
  cookieHeader: string | null,
  name: string
): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(`${name}=`))
  if (!match) return null
  return match.split('=').slice(1).join('=') || null
}
