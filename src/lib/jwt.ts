import { SignJWT, jwtVerify, decodeJwt } from 'jose'
import { TOKEN_CONFIG } from '@/constants'
import { env } from '@/config/env'

export interface UserClaims {
  sub: string
  email: string
  name: string
  role: 'user' | 'admin' | 'moderator'
  lang: 'en' | 'zh' | 'ms'
  isEmailVerified: boolean
}

function getSecret(): Uint8Array {
  const secret =
    env.JWT_SECRET ??
    (!env.isProduction
      ? 'dev-only-fallback-secret-change-in-production!'
      : null)

  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is required in production. ' +
        'Run: openssl rand -base64 64 and set as JWT_SECRET in .env.local'
    )
  }

  return new TextEncoder().encode(secret)
}

export async function signAccessToken(claims: UserClaims): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  return new SignJWT(claims as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE_S)
    .sign(getSecret())
}

export async function verifyAccessToken(
  token: string
): Promise<UserClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
      return null
    }
    return {
      sub: payload.sub,
      email: payload.email,
      name: String(payload.name ?? ''),
      role: (payload.role as UserClaims['role']) ?? 'user',
      lang: (payload.lang as UserClaims['lang']) ?? 'en',
      isEmailVerified: Boolean(payload.isEmailVerified),
    }
  } catch {
    return null
  }
}

/** Decode a JWT without verifying the signature — used to extract claims from an expired access token during refresh. */
export function decodeAccessToken(token: string): UserClaims | null {
  try {
    const payload = decodeJwt(token)
    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
      return null
    }
    return {
      sub: payload.sub,
      email: payload.email,
      name: String(payload.name ?? ''),
      role: (payload.role as UserClaims['role']) ?? 'user',
      lang: (payload.lang as UserClaims['lang']) ?? 'en',
      isEmailVerified: Boolean(payload.isEmailVerified),
    }
  } catch {
    return null
  }
}
