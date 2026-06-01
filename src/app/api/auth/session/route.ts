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
import { DEMO_CONFIG } from '@/constants'
import type { ServiceResponse, User } from '@/types/api'
import { USE_REAL_API_SERVER } from '@/constants/config'

const ACCESS_TOKEN_LIFETIME_MS = 15 * 60 * 1000 // 15 minutes — must match login route

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
      user = validateMockToken(authToken)
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid session'
    return unauthorizedResponse(message)
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

function validateMockToken(token: string): User {
  if (!token || token.length === 0) {
    throw new Error('Empty token')
  }

  // Mock token format: mock_access_<issuedAtMs>_<randomId>
  // or the older demo_access_<issuedAtMs>_<randomId> fallback
  const parts = token.split('_')
  if (parts.length >= 3) {
    const timestampStr = parts[2]
    const issuedAt = parseInt(timestampStr, 10)
    if (!isNaN(issuedAt) && Date.now() > issuedAt + ACCESS_TOKEN_LIFETIME_MS) {
      throw new Error('Access token expired')
    }
  }

  // For the mock service the token represents the demo user
  const { DEMO_USER } = DEMO_CONFIG
  const user: User = {
    id: DEMO_USER.id,
    email: DEMO_USER.email,
    name: DEMO_USER.name,
    role: DEMO_USER.role,
    lang: DEMO_USER.lang,
    isEmailVerified: DEMO_USER.isEmailVerified,
    avatar: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return user
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
