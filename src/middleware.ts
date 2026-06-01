import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { env } from '@/config/env'
import { generateSecureToken, rateLimiter } from '@/utils/security'
import { ROUTES, RATE_LIMITS, SECURITY_CONFIG } from '@/constants'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale, type Locale } from '@/i18n/config'

/**
 * Optimized middleware following industry best practices
 * - Separated concerns (security, i18n, auth)
 * - Early returns for performance
 * - Proper composition pattern
 * - No code duplication
 * - Constants extracted for maintainability
 */

// Route configurations (from constants)
const PROTECTED_ROUTES = ROUTES.PROTECTED
const AUTH_ROUTES = ROUTES.AUTH
const LEGAL_ROUTES = ROUTES.LEGAL

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
})

// Security utilities
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim())
    return ips[ips.length - 1] // rightmost = set by trusted proxy
  }
  return request.headers.get('x-real-ip') ?? 'unknown'
}

function isAuthenticated(request: NextRequest): boolean {
  const authToken = request.cookies.get('auth_token')?.value
  return !!authToken && authToken.length > 0
}

function shouldSkipMiddleware(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  )
}

function isLegalDocument(pathname: string): boolean {
  return (LEGAL_ROUTES as readonly string[]).includes(pathname)
}

function applyRateLimit(request: NextRequest): boolean {
  const clientIP = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const { pathname } = request.nextUrl

  // Auth API routes have strictest limits to prevent brute force
  if (pathname.startsWith('/api/auth/')) {
    return rateLimiter.isRateLimited(
      `auth:${clientIP}`,
      RATE_LIMITS.AUTH.requests,
      RATE_LIMITS.AUTH.windowMs
    )
  }

  // Other API routes have stricter limits
  if (pathname.startsWith('/api/')) {
    return rateLimiter.isRateLimited(
      `api:${clientIP}`,
      RATE_LIMITS.API.requests,
      RATE_LIMITS.API.windowMs
    )
  }

  // Auth routes have strictest limits to prevent brute force
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

  // General routes
  return rateLimiter.isRateLimited(
    `general:${clientIP}:${userAgent}`,
    RATE_LIMITS.GENERAL.requests,
    RATE_LIMITS.GENERAL.windowMs
  )
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  const nonce = generateSecureToken(16)

  // Core security headers
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
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
    'X-Nonce': nonce,
  }

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // HSTS for production
  if (env.isProduction) {
    response.headers.set(
      'Strict-Transport-Security',
      `max-age=${SECURITY_CONFIG.HSTS_MAX_AGE}; includeSubDomains; preload`
    )
  }

  // Content Security Policy
  const cspDirectives = env.isProduction
    ? [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
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
        'block-all-mixed-content',
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
    headers: { 'Retry-After': '900' },
  })
}

function handleLegalRoutes(
  request: NextRequest,
  pathname: string
): NextResponse | null {
  // Handle direct legal document access
  if (isLegalDocument(pathname)) {
    return addSecurityHeaders(NextResponse.next())
  }

  // Redirect old locale-based legal documents
  const legalRedirectMatch = pathname.match(/^\/(en|zh|ms)\/(terms|privacy)$/)
  if (legalRedirectMatch) {
    const [, , document] = legalRedirectMatch
    const redirectUrl = new URL(`/${document}`, request.url)
    return NextResponse.redirect(redirectUrl, 301)
  }

  return null
}

function handleAuthentication(
  request: NextRequest,
  pathname: string
): NextResponse | null {
  // Extract locale from pathname using next-intl pattern
  const segments = pathname.split('/').filter(Boolean)
  const potentialLocale = segments[0]
  const isValidLocale = locales.includes(potentialLocale as Locale)

  const locale = isValidLocale ? potentialLocale : defaultLocale
  const pathWithoutLocale = isValidLocale
    ? `/${segments.slice(1).join('/')}`
    : pathname

  const url = pathname + request.nextUrl.search
  const isUserAuth = isAuthenticated(request)

  // Check if current path is protected or auth route
  const isProtected = PROTECTED_ROUTES.some(
    route =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  )
  const isAuth = AUTH_ROUTES.some(
    route =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  )

  // Redirect unauthenticated users from protected routes
  if (isProtected && !isUserAuth) {
    const loginUrl = new URL(
      `/${locale}${ROUTES.DEFAULT_UNAUTHENTICATED}`,
      request.url
    )
    loginUrl.searchParams.set('redirect', url)
    return addSecurityHeaders(NextResponse.redirect(loginUrl))
  }

  // Redirect authenticated users from auth routes
  if (isAuth && isUserAuth) {
    const showcaseUrl = new URL(
      `/${locale}${ROUTES.DEFAULT_AUTHENTICATED}`,
      request.url
    )
    return addSecurityHeaders(NextResponse.redirect(showcaseUrl))
  }

  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Early returns for performance
  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next()
  }

  // Handle legal documents first (these don't need i18n)
  const legalResponse = handleLegalRoutes(request, pathname)
  if (legalResponse) return legalResponse

  // API routes: rate limiting only
  // Note: logger not used here — it references window.navigator which is unavailable in Edge Runtime
  if (pathname.startsWith('/api/')) {
    if (applyRateLimit(request)) {
      console.warn(
        `API rate limit exceeded: ${getClientIP(request)} - ${pathname}`
      )
      return createRateLimitResponse()
    }
    return NextResponse.next()
  }

  // For root path, let next-intl handle the redirect immediately
  if (pathname === '/') {
    const intlResponse = intlMiddleware(request)
    return addSecurityHeaders(intlResponse)
  }

  if (applyRateLimit(request)) {
    console.warn(`Rate limit exceeded: ${getClientIP(request)} - ${pathname}`)
    return createRateLimitResponse()
  }

  // Apply i18n middleware
  const intlResponse = intlMiddleware(request)

  // Handle i18n redirects
  if (
    intlResponse &&
    (intlResponse.status === 307 ||
      intlResponse.status === 308 ||
      intlResponse.status === 302)
  ) {
    return addSecurityHeaders(intlResponse)
  }

  // Handle authentication after i18n processing
  const authResponse = handleAuthentication(request, pathname)
  if (authResponse) return authResponse

  // Default response with security headers
  const response = intlResponse || NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|sw.js|workbox-.*|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
