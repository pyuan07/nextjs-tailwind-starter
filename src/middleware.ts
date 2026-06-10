import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { env } from '@/config/env'
import { rateLimiter } from '@/utils/security'
import { ROUTES, RATE_LIMITS, SECURITY_CONFIG } from '@/constants'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { locales, defaultLocale, type Locale } from '@/i18n/config'
import { matchesRoute } from '@/lib/route-matching'
import { verifyAccessToken } from '@/lib/jwt'

const PROTECTED_ROUTES = ROUTES.PROTECTED
const AUTH_ROUTES = ROUTES.AUTH

const intlMiddleware = createMiddleware(routing)

// Static file extensions that middleware should never process
const STATIC_FILE_RE =
  /\.(svg|png|jpe?g|gif|webp|ico|css|js|map|txt|xml|json|woff2?)$/i

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return (
    (request as unknown as { ip?: string }).ip ??
    forwarded?.split(',')[0]?.trim() ??
    'unknown'
  )
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const authToken = request.cookies.get('auth_token')?.value
  if (!authToken) return false
  const claims = await verifyAccessToken(authToken)
  return claims !== null
}

function shouldSkipMiddleware(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    STATIC_FILE_RE.test(pathname) ||
    pathname === '/favicon.ico'
  )
}

function applyRateLimit(request: NextRequest): boolean {
  const clientIP = getClientIP(request)
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/auth/')) {
    return rateLimiter.isRateLimited(
      `auth:${clientIP}`,
      RATE_LIMITS.AUTH.requests,
      RATE_LIMITS.AUTH.windowMs
    )
  }

  if (pathname.startsWith('/api/')) {
    return rateLimiter.isRateLimited(
      `api:${clientIP}`,
      RATE_LIMITS.API.requests,
      RATE_LIMITS.API.windowMs
    )
  }

  if (
    pathname.includes('/login') ||
    pathname.includes('/register') ||
    pathname.includes('/forgot-password')
  ) {
    return rateLimiter.isRateLimited(
      `auth:${clientIP}`,
      RATE_LIMITS.AUTH.requests,
      RATE_LIMITS.AUTH.windowMs
    )
  }

  return rateLimiter.isRateLimited(
    `general:${clientIP}`,
    RATE_LIMITS.GENERAL.requests,
    RATE_LIMITS.GENERAL.windowMs
  )
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Core security headers
  const headers: Record<string, string> = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    // X-XSS-Protection is deprecated (can introduce bugs in old IE); omit it.
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-DNS-Prefetch-Control': 'off',
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'bluetooth=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
      'ambient-light-sensor=()',
    ].join(', '),
  }

  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value)
  }

  if (env.isProduction) {
    const hstsDirectives = [
      `max-age=${SECURITY_CONFIG.HSTS_MAX_AGE}`,
      SECURITY_CONFIG.HSTS_INCLUDE_SUBDOMAINS ? 'includeSubDomains' : '',
      SECURITY_CONFIG.HSTS_PRELOAD ? 'preload' : '',
    ]
      .filter(Boolean)
      .join('; ')

    response.headers.set('Strict-Transport-Security', hstsDirectives)
  }

  // CSP: use 'self' for script-src — compatible with Next.js static pre-rendering.
  // Note: nonce-based CSP requires force-dynamic rendering on every page.
  // 'block-all-mixed-content' is deprecated (superseded by upgrade-insecure-requests).
  const cspDirectives = env.isProduction
    ? [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self'",
        "connect-src 'self' https:",
        "media-src 'self'",
        "object-src 'none'",
        "child-src 'self'",
        "worker-src 'self' blob:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        'upgrade-insecure-requests',
      ]
    : [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self'",
        "connect-src 'self' https: ws: wss:",
        "media-src 'self'",
        "object-src 'none'",
        "child-src 'self'",
        "worker-src 'self' blob:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ]

  response.headers.set('Content-Security-Policy', cspDirectives.join('; '))
  return response
}

function createRateLimitResponse(): NextResponse {
  return new NextResponse('Too Many Requests', {
    status: 429,
    headers: {
      'Retry-After': String(Math.ceil(RATE_LIMITS.AUTH.windowMs / 1000)),
    },
  })
}

async function handleAuthentication(
  request: NextRequest,
  pathname: string
): Promise<NextResponse | null> {
  const segments = pathname.split('/').filter(Boolean)
  const potentialLocale = segments[0]
  const isValidLocale = locales.includes(potentialLocale as Locale)

  const locale = isValidLocale ? potentialLocale : defaultLocale
  const pathWithoutLocale = isValidLocale
    ? `/${segments.slice(1).join('/')}`
    : pathname

  const isUserAuth = await isAuthenticated(request)
  const isProtected = matchesRoute(pathWithoutLocale, PROTECTED_ROUTES)
  const isAuth = matchesRoute(pathWithoutLocale, AUTH_ROUTES)

  if (isProtected && !isUserAuth) {
    const loginUrl = new URL(
      `/${locale}${ROUTES.DEFAULT_UNAUTHENTICATED}`,
      request.url
    )
    loginUrl.searchParams.set('redirect', pathname)
    return addSecurityHeaders(NextResponse.redirect(loginUrl))
  }

  if (isAuth && isUserAuth) {
    const showcaseUrl = new URL(
      `/${locale}${ROUTES.DEFAULT_AUTHENTICATED}`,
      request.url
    )
    return addSecurityHeaders(NextResponse.redirect(showcaseUrl))
  }

  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (shouldSkipMiddleware(pathname)) return NextResponse.next()

  if (pathname.startsWith('/api/')) {
    if (applyRateLimit(request)) {
      console.warn(
        `API rate limit exceeded: ${getClientIP(request)} - ${pathname}`
      )
      return createRateLimitResponse()
    }
    return NextResponse.next()
  }

  if (pathname === '/') {
    return addSecurityHeaders(intlMiddleware(request))
  }

  if (applyRateLimit(request)) {
    console.warn(`Rate limit exceeded: ${getClientIP(request)} - ${pathname}`)
    return createRateLimitResponse()
  }

  const intlResponse = intlMiddleware(request)

  if (
    intlResponse &&
    (intlResponse.status === 307 ||
      intlResponse.status === 308 ||
      intlResponse.status === 302)
  ) {
    return addSecurityHeaders(intlResponse)
  }

  const authResponse = await handleAuthentication(request, pathname)
  if (authResponse) return authResponse

  return addSecurityHeaders(intlResponse || NextResponse.next())
}

// Nonce generation hint:
// If you add force-dynamic server pages and want nonce-based CSP, you can generate
// a nonce here and thread it via request headers (x-nonce) + NextResponse.next({ request: { headers } }).
// Static pages built with generateStaticParams cannot use per-request nonces.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sw.js|workbox-.*|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
