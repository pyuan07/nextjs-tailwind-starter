/**
 * Server-side auth cookie helpers for Next.js route handlers.
 *
 * Cookie layout:
 *   auth_token    – short-lived access token  (HttpOnly; 15 min)
 *   refresh_token – long-lived refresh token  (HttpOnly; 7 days; Path=/api/auth/refresh)
 *   csrf_token    – CSRF nonce                (NOT HttpOnly; JS must read it; 15 min)
 *   auth_persist  – remember-me flag          (HttpOnly; 7 days; cleared on logout)
 */

import { NextResponse } from 'next/server'
import { TOKEN_CONFIG } from '@/constants'

const isProduction = process.env.NODE_ENV === 'production'

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  remember?: boolean
): NextResponse {
  response.cookies.set('auth_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    ...(remember ? { maxAge: TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE_S } : {}),
  })

  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/api/auth/refresh',
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
      sameSite: 'strict',
      path: '/',
      maxAge: TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE_S,
    })
  } else {
    // Explicitly clear it so that toggling "remember me" off takes effect
    response.cookies.set('auth_persist', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
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
    sameSite: 'strict',
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
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 0,
  }

  response.cookies.set('auth_token', '', base)
  response.cookies.set('refresh_token', '', {
    ...base,
    path: '/api/auth/refresh',
  })
  response.cookies.set('csrf_token', '', { ...base, httpOnly: false })
  response.cookies.set('auth_persist', '', base)

  return response
}

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
