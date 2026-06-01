/**
 * GET /api/auth/csrf
 *
 * Issues a fresh CSRF token as a JS-readable cookie and also returns it
 * in the response body so the client can seed its in-memory state without
 * a second cookie read.
 *
 * Clients should call this endpoint once on app load (or after a hard
 * navigation) and store the token in memory to inject it as the
 * x-csrf-token header on every state-mutating API call.
 */

import { NextResponse } from 'next/server'
import { setCsrfCookie, generateCsrfToken } from '@/lib/auth-cookies'
import type { ServiceResponse } from '@/types/api'

export async function GET(): Promise<NextResponse> {
  const csrfToken = generateCsrfToken()

  const response = NextResponse.json(
    {
      success: true,
      message: 'CSRF token issued',
      data: { csrfToken },
    } satisfies ServiceResponse<{ csrfToken: string }>,
    { status: 200 }
  )

  setCsrfCookie(response, csrfToken)

  return response
}
