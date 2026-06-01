/**
 * GET /api/auth/csrf
 *
 * Issues a fresh CSRF token as a JS-readable cookie (csrf_token).
 * The token is NOT returned in the response body to avoid exposing it
 * unnecessarily — clients read it from the cookie via document.cookie.
 *
 * Clients should call this endpoint once on app load (or after a hard
 * navigation) and store the token in memory to inject it as the
 * x-csrf-token header on every state-mutating API call.
 */

import { NextResponse } from 'next/server'
import { setCsrfCookie, generateCsrfToken } from '@/lib/auth-cookies'
import type { VoidServiceResponse } from '@/types/api'

export async function GET(): Promise<NextResponse> {
  const csrfToken = generateCsrfToken()

  const response = NextResponse.json(
    {
      success: true,
      message: 'CSRF token issued',
    } satisfies VoidServiceResponse,
    { status: 200 }
  )

  setCsrfCookie(response, csrfToken)

  return response
}
