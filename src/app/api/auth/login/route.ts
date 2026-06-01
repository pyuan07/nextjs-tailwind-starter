/**
 * POST /api/auth/login
 *
 * Authenticates a user and issues HttpOnly auth cookies.
 * The response body never contains the raw tokens — only user data.
 *
 * CSRF validation:
 *   If a csrf_token cookie is already present the request MUST supply a
 *   matching x-csrf-token header (double-submit cookie pattern).
 *   First-time requests (no existing csrf_token) skip the check so the
 *   login page itself can always reach this endpoint.
 */

import { NextResponse } from 'next/server'
import { MockAuthService } from '@/services/mock-auth.service'
import {
  setAuthCookies,
  setCsrfCookie,
  generateCsrfToken,
  parseCookieValue,
} from '@/lib/auth-cookies'
import type {
  LoginRequest,
  ServiceResponse,
  User,
  TokenPair,
} from '@/types/api'
import { USE_REAL_API_SERVER } from '@/constants/config'

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

export async function POST(request: Request): Promise<NextResponse> {
  // ── CSRF double-submit validation ────────────────────────────────────────
  const cookieHeader = request.headers.get('cookie') ?? ''
  const csrfCookie = parseCookieValue(cookieHeader, 'csrf_token')
  const csrfHeader = request.headers.get('x-csrf-token')

  if (!csrfHeader || csrfCookie !== csrfHeader) {
    return errorResponse('Invalid CSRF token', 403)
  }

  // ── Parse and validate body ──────────────────────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Invalid request body', 400)
  }

  if (!isLoginRequest(body)) {
    return errorResponse('email and password are required', 400)
  }

  const remember =
    typeof (body as Record<string, unknown>).remember === 'boolean'
      ? ((body as Record<string, unknown>).remember as boolean)
      : false

  const credentials: LoginRequest = {
    email: body.email.trim().toLowerCase(),
    password: body.password,
    remember,
  }

  // ── Authenticate ─────────────────────────────────────────────────────────
  let result: ServiceResponse<{ user: User; tokens: TokenPair }>

  try {
    if (USE_REAL_API_SERVER) {
      // Real API path: dynamic import to keep bundle clean when not used
      const { authService } = await import('@/services/auth.service')
      result = await authService.login(credentials)
    } else {
      result = await MockAuthService.login(credentials)
    }
  } catch (err) {
    console.error('[auth] login failed:', err)
    return errorResponse('Authentication failed', 401)
  }

  if (!result.success) {
    return errorResponse(result.message, 401)
  }

  const { user, tokens } = result.data

  // ── Build response — no tokens in body ───────────────────────────────────
  const csrfToken = generateCsrfToken()

  const response = NextResponse.json(
    {
      success: true,
      message: result.message,
      data: { user },
    } satisfies ServiceResponse<{ user: User }>,
    { status: 200 }
  )

  setAuthCookies(
    response,
    tokens.accessToken,
    tokens.refreshToken,
    credentials.remember
  )
  setCsrfCookie(response, csrfToken)

  return response
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function isLoginRequest(
  value: unknown
): value is { email: string; password: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'email' in value &&
    'password' in value &&
    typeof (value as Record<string, unknown>).email === 'string' &&
    typeof (value as Record<string, unknown>).password === 'string' &&
    (value as Record<string, unknown>).email !== '' &&
    (value as Record<string, unknown>).password !== ''
  )
}
