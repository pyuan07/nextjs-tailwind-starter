/**
 * POST /api/auth/logout
 *
 * Clears all auth cookies (auth_token, refresh_token, csrf_token) and
 * returns a success response.  No sensitive data is required in the body.
 *
 * CSRF validation:
 *   The logout endpoint IS state-mutating, so we enforce the CSRF double-submit
 *   check — the x-csrf-token header is always required for this endpoint.
 */

import { NextResponse } from 'next/server'
import { clearAuthCookies, parseCookieValue } from '@/lib/auth-cookies'
import type { VoidServiceResponse } from '@/types/api'

function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      errors: [message],
    } satisfies VoidServiceResponse,
    { status }
  )
}

export async function POST(request: Request): Promise<NextResponse> {
  // ── CSRF double-submit validation ────────────────────────────────────────
  const cookieHeader = request.headers.get('cookie') ?? ''
  const existingCsrf = parseCookieValue(cookieHeader, 'csrf_token')
  const headerCsrf = request.headers.get('x-csrf-token')

  // Require BOTH a header and a matching cookie (same strictness as login/refresh).
  // Logout is state-mutating, so a missing csrf cookie must NOT pass the check.
  if (!headerCsrf || !existingCsrf || existingCsrf !== headerCsrf) {
    return errorResponse('CSRF token required', 403)
  }

  // ── Clear all auth cookies ───────────────────────────────────────────────
  const response = NextResponse.json(
    {
      success: true,
      message: 'Logged out successfully',
    } satisfies VoidServiceResponse,
    { status: 200 }
  )

  clearAuthCookies(response)

  return response
}
