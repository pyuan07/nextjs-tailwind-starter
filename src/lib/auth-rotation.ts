/**
 * Shared token-rotation logic.
 *
 * Used by BOTH:
 *   - POST /api/auth/refresh   (explicit client-driven rotation)
 *   - GET  /api/auth/session   (silent self-heal when the access token has
 *                               expired but the refresh token is still valid)
 *
 * Keeping this in one place guarantees the mock and real-API rotation rules
 * stay identical across the two entry points.
 */

import { signAccessToken, decodeAccessToken } from '@/lib/jwt'
import type { TokenPair } from '@/types/api'
import { DEMO_CONFIG, TOKEN_CONFIG } from '@/constants/config'

/**
 * Rotate a refresh token into a fresh { access, refresh } pair.
 *
 * @param currentRefreshToken  the refresh token read from the HttpOnly cookie
 * @param oldAccessToken       the (possibly expired) access token, used to
 *                             recover the user claims in the mock path
 * @param useRealApi           whether to delegate rotation to the real backend
 * @throws if the refresh token is missing, malformed, or expired
 */
export async function rotateTokens(
  currentRefreshToken: string,
  oldAccessToken: string | null,
  useRealApi: boolean
): Promise<TokenPair> {
  return useRealApi
    ? rotateViaRealApi(currentRefreshToken)
    : rotateViaMock(currentRefreshToken, oldAccessToken)
}

async function rotateViaMock(
  currentRefreshToken: string,
  oldAccessToken: string | null
): Promise<TokenPair> {
  if (!currentRefreshToken) throw new Error('Invalid refresh token')

  // Validate refresh token expiry — format: mock_refresh_<issuedAtMs>_<id>
  const parts = currentRefreshToken.split('_')
  if (parts.length >= 3) {
    const issuedAt = parseInt(parts[2] ?? '', 10)
    if (
      !isNaN(issuedAt) &&
      Date.now() > issuedAt + TOKEN_CONFIG.REFRESH_TOKEN_LIFETIME
    ) {
      throw new Error('Refresh token expired')
    }
  }

  // Recover user claims from the old (possibly expired) access token.
  // decodeAccessToken does NOT verify the signature — it only decodes.
  // This is intentional: the refresh token already proved the session is valid.
  const { DEMO_USER } = DEMO_CONFIG
  const fallbackClaims = {
    sub: String(DEMO_USER.id),
    email: DEMO_USER.email,
    name: DEMO_USER.name,
    role: DEMO_USER.role,
    lang: DEMO_USER.lang,
    isEmailVerified: DEMO_USER.isEmailVerified,
  }

  const claims =
    (oldAccessToken ? decodeAccessToken(oldAccessToken) : null) ??
    fallbackClaims

  const accessToken = await signAccessToken(claims)
  const now = Date.now()
  const randomId = crypto.randomUUID().replace(/-/g, '').substring(0, 13)

  return {
    accessToken,
    refreshToken: `mock_refresh_${now}_${randomId}`,
    accessTokenExpiry: now + TOKEN_CONFIG.ACCESS_TOKEN_LIFETIME,
    refreshTokenExpiry: now + TOKEN_CONFIG.REFRESH_TOKEN_LIFETIME,
    tokenType: 'Bearer',
  }
}

async function rotateViaRealApi(refreshToken: string): Promise<TokenPair> {
  const { api } = await import('@/lib/api')
  const { API_ENDPOINTS } = await import('@/types/api')

  const response = await api.post<{
    access: { token: string; expires: string }
    refresh: { token: string; expires: string }
  }>(API_ENDPOINTS.auth.refresh, { refreshToken })

  return {
    accessToken: response.access.token,
    refreshToken: response.refresh.token,
    accessTokenExpiry: new Date(response.access.expires).getTime(),
    refreshTokenExpiry: new Date(response.refresh.expires).getTime(),
    tokenType: 'Bearer',
  }
}
