/**
 * GET   /api/user/profile  – read the signed-in user's profile
 * PATCH /api/user/profile  – update the signed-in user's profile
 *
 * Why this route exists:
 *   Access tokens live in HttpOnly cookies, so the browser cannot read them
 *   and cannot attach `Authorization: Bearer …` to a direct call against the
 *   external API. Previously the client called that API straight from
 *   auth.service.ts, which meant every authenticated request went out with no
 *   credentials at all whenever USE_REAL_API was enabled.
 *
 *   This handler is the missing hop: it runs on the server, reads the HttpOnly
 *   cookie, and forwards the bearer to the backend. The browser only ever talks
 *   to this same-origin route.
 *
 * CSRF: PATCH is state-mutating and enforces the double-submit check, matching
 * the /api/auth/* routes. GET is a safe method and does not.
 */

import { NextResponse } from 'next/server'
import {
  parseCookieValue,
  csrfTokensMatch,
  clearAuthCookies,
} from '@/lib/auth-cookies'
import { verifyAccessToken, type UserClaims } from '@/lib/jwt'
import { MockAuthService } from '@/services/mock-auth.service'
import { USE_REAL_API_SERVER } from '@/constants/config'
import type { ServiceResponse, User, UpdateUserRequest } from '@/types/api'
import { profilePatchSchema } from '@/lib/validations/auth'

function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      errors: [message],
    } satisfies ServiceResponse<never>,
    { status }
  )
}

function unauthorized(): NextResponse {
  const resp = errorResponse('Not authenticated', 401)
  clearAuthCookies(resp)
  return resp
}

/** Resolve the caller from the HttpOnly access token, or null when invalid. */
async function authenticate(
  request: Request
): Promise<{ claims: UserClaims; accessToken: string } | null> {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const accessToken = parseCookieValue(cookieHeader, 'auth_token')
  if (!accessToken) return null

  const claims = await verifyAccessToken(accessToken)
  if (!claims) return null

  return { claims, accessToken }
}

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

export async function GET(request: Request): Promise<NextResponse> {
  const auth = await authenticate(request)
  if (!auth) return unauthorized()

  try {
    let user: User

    if (USE_REAL_API_SERVER) {
      const { api } = await import('@/lib/api')
      const { API_ENDPOINTS } = await import('@/types/api')
      const response = await api.get<{ user: User }>(
        API_ENDPOINTS.users.profile,
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      )
      user = response.user
    } else {
      // Prefer the mock store so previously applied updates are reflected;
      // fall back to the token claims for users it does not know about.
      const result = MockAuthService.getProfileFor(auth.claims.email)
      user =
        result.success && result.data ? result.data : claimsToUser(auth.claims)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profile retrieved',
        data: user,
      } satisfies ServiceResponse<User>,
      { status: 200 }
    )
  } catch (err) {
    console.error('[user] profile fetch failed:', err)
    return errorResponse('Failed to load profile', 502)
  }
}

export async function PATCH(request: Request): Promise<NextResponse> {
  // ── CSRF double-submit validation ────────────────────────────────────────
  const cookieHeader = request.headers.get('cookie') ?? ''
  const csrfCookie = parseCookieValue(cookieHeader, 'csrf_token')
  const csrfHeader = request.headers.get('x-csrf-token')

  if (!csrfTokensMatch(csrfCookie, csrfHeader)) {
    return errorResponse('Invalid CSRF token', 403)
  }

  const auth = await authenticate(request)
  if (!auth) return unauthorized()

  // ── Parse and validate body ──────────────────────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Invalid request body', 400)
  }

  const parsed = profilePatchSchema.safeParse(body)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors
    const errors = Object.values(fieldErrors).flatMap(msgs => msgs ?? [])
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request data',
        errors,
      } satisfies ServiceResponse<never>,
      { status: 400 }
    )
  }

  const updates = parsed.data as UpdateUserRequest

  try {
    let user: User

    if (USE_REAL_API_SERVER) {
      const { api } = await import('@/lib/api')
      const { API_ENDPOINTS } = await import('@/types/api')
      const response = await api.patch<{ user: User }>(
        API_ENDPOINTS.users.updateProfile,
        updates,
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      )
      user = response.user
    } else {
      const result = MockAuthService.updateProfileFor(
        auth.claims.email,
        updates
      )
      if (!result.success || !result.data) {
        return errorResponse(result.message || 'Update failed', 400)
      }
      user = result.data
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated',
        data: user,
      } satisfies ServiceResponse<User>,
      { status: 200 }
    )
  } catch (err) {
    console.error('[user] profile update failed:', err)
    return errorResponse('Failed to update profile', 502)
  }
}
