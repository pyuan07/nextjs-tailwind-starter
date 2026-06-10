/**
 * POST /api/auth/login
 *
 * Authenticates a user and issues HttpOnly auth cookies.
 * The response body never contains the raw tokens — only user data.
 *
 * CSRF validation:
 *   The x-csrf-token header is always required and must match the csrf_token
 *   cookie (double-submit cookie pattern). The client fetches a fresh CSRF
 *   token via GET /api/auth/csrf before submitting this request.
 */

import { NextResponse } from 'next/server'
import { MockAuthService } from '@/services/mock-auth.service'
import {
  setAuthCookies,
  setAuthPersistCookie,
  setCsrfCookie,
  generateCsrfToken,
  parseCookieValue,
} from '@/lib/auth-cookies'
import { signAccessToken } from '@/lib/jwt'
import type { ServiceResponse, User, TokenPair } from '@/types/api'
import { USE_REAL_API_SERVER } from '@/constants/config'
import { loginSchema } from '@/lib/validations/auth'

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

  const parsed = loginSchema.safeParse(body)
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

  const credentials = {
    email: parsed.data.email.trim().toLowerCase(),
    password: parsed.data.password,
    remember: parsed.data.remember ?? false,
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

  // ── Sign real JWT access token ────────────────────────────────────────────
  const accessToken = await signAccessToken({
    sub: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role,
    lang: user.lang,
    isEmailVerified: user.isEmailVerified,
  })

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
    accessToken,
    tokens.refreshToken,
    credentials.remember
  )
  setAuthPersistCookie(response, credentials.remember)
  setCsrfCookie(response, csrfToken)

  return response
}
