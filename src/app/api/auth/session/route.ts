/**
 * GET /api/auth/session
 *
 * Reads the HttpOnly auth_token cookie and returns the authenticated user.
 * This is the single source of truth for "am I logged in?" on the client side.
 *
 * For the mock auth path the token encodes the issue timestamp.  We extract
 * it to verify the token has not exceeded the 15-minute access token window.
 * For a real API the token would be a signed JWT verified here with `jose`.
 */

import { NextResponse } from 'next/server'
import { clearAuthCookies, parseCookieValue } from '@/lib/auth-cookies'
import { verifyAccessToken } from '@/lib/jwt'
import type { ServiceResponse, User } from '@/types/api'
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

  if (!authToken) {
    return unauthorizedResponse('Not authenticated')
  }

  let user: User

  try {
    if (USE_REAL_API_SERVER) {
      user = await validateViaRealApi(authToken)
    } else {
      user = await validateViaJWT(authToken)
    }
  } catch (err) {
    console.error('[auth] session validation failed:', err)
    return unauthorizedResponse('Session invalid')
  }

  return NextResponse.json(
    {
      success: true,
      message: 'Session valid',
      data: { user },
    } satisfies ServiceResponse<{ user: User }>,
    { status: 200 }
  )
}

// ── Validation implementations ────────────────────────────────────────────────

async function validateViaJWT(token: string): Promise<User> {
  const claims = await verifyAccessToken(token)
  if (!claims) throw new Error('Invalid or expired access token')

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
  // When jose is available this should verify the JWT signature.
  // For now we call the profile endpoint with the Bearer token.
  const { api } = await import('@/lib/api')
  const { API_ENDPOINTS } = await import('@/types/api')

  const response = await api.get<{ user: User }>(API_ENDPOINTS.users.profile, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.user
}
