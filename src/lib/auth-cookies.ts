/**
 * Server-side auth cookie helpers for Next.js route handlers.
 *
 * Cookie layout:
 *   auth_token    – short-lived access token  (HttpOnly; 15 min)
 *   refresh_token – long-lived refresh token  (HttpOnly; 7 days; Path=/api/auth)
 *   csrf_token    – CSRF nonce                (NOT HttpOnly; JS must read it; 15 min)
 *   auth_persist  – remember-me flag          (HttpOnly; 7 days; cleared on logout)
 */

import { NextResponse } from 'next/server'
import { TOKEN_CONFIG } from '@/constants'

const isProduction = process.env.NODE_ENV === 'production'

/**
 * SameSite policy for auth cookies.
 *
 * 'lax' rather than 'strict': with 'strict' the browser withholds these cookies
 * on any cross-site top-level navigation, so a user following a link from an
 * email, a chat app, or a search result lands on the site logged out, and only
 * appears logged in after an in-app navigation. 'lax' still withholds cookies
 * on cross-site POST/iframe/XHR, which is the case that matters for CSRF — and
 * every state-mutating route additionally enforces the double-submit check.
 */
const SAME_SITE = 'lax' as const

/**
 * Path scope for the refresh token cookie.
 *
 * It must cover BOTH consumers of the refresh token:
 *   POST /api/auth/refresh  – explicit client-driven rotation
 *   GET  /api/auth/session  – silent self-heal when the access token expired
 *
 * Scoping this to '/api/auth/refresh' (as it previously was) meant the browser
 * never sent the cookie to /api/auth/session, so the self-heal path there was
 * unreachable and users were logged out 15 minutes after login even with
 * "remember me" checked. '/api/auth' is the narrowest scope that covers both.
 */
const REFRESH_TOKEN_PATH = '/api/auth'

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  remember?: boolean
): NextResponse {
  response.cookies.set('auth_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: SAME_SITE,
    path: '/',
    ...(remember ? { maxAge: TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE_S } : {}),
  })

  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: SAME_SITE,
    path: REFRESH_TOKEN_PATH,
    ...(remember ? { maxAge: TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE_S } : {}),
  })

  return response
}

/**
 * Persist the "remember me" preference as an HttpOnly cookie alongside
 * the refresh token. Called by the login and refresh routes.
 */
export function setAuthPersistCookie(
  response: NextResponse,
  remember: boolean
): NextResponse {
  if (remember) {
    response.cookies.set('auth_persist', '1', {
      httpOnly: true,
      secure: isProduction,
      sameSite: SAME_SITE,
      path: '/',
      maxAge: TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE_S,
    })
  } else {
    // Explicitly clear it so that toggling "remember me" off takes effect
    response.cookies.set('auth_persist', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: SAME_SITE,
      path: '/',
      maxAge: 0,
    })
  }
  return response
}

/** Set a JS-readable CSRF cookie. The client reads it and injects it as x-csrf-token. */
export function setCsrfCookie(
  response: NextResponse,
  csrfToken: string
): NextResponse {
  response.cookies.set('csrf_token', csrfToken, {
    httpOnly: false,
    secure: isProduction,
    sameSite: SAME_SITE,
    path: '/',
    maxAge: TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE_S,
  })
  return response
}

/** Expire all auth cookies (including auth_persist) by setting Max-Age=0. */
export function clearAuthCookies(response: NextResponse): NextResponse {
  const base = {
    httpOnly: true,
    secure: isProduction,
    sameSite: SAME_SITE,
    path: '/',
    maxAge: 0,
  }

  response.cookies.set('auth_token', '', base)
  response.cookies.set('refresh_token', '', {
    ...base,
    path: REFRESH_TOKEN_PATH,
  })
  response.cookies.set('csrf_token', '', { ...base, httpOnly: false })
  response.cookies.set('auth_persist', '', base)

  return response
}

export function generateCsrfToken(): string {
  return crypto.randomUUID()
}

/**
 * Validate a double-submit CSRF pair in constant time.
 *
 * Both halves must be present and equal. The comparison avoids `!==` so it
 * does not short-circuit on the first differing byte and leak the matching
 * prefix length through timing. Edge-runtime safe (no node:crypto).
 */
export function csrfTokensMatch(
  cookieToken: string | null,
  headerToken: string | null
): boolean {
  if (!cookieToken || !headerToken) return false
  if (cookieToken.length !== headerToken.length) return false

  let diff = 0
  for (let i = 0; i < cookieToken.length; i++) {
    diff |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i)
  }
  return diff === 0
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
