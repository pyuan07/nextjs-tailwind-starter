import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { env } from '@/config/env'
import { generateSecureToken, rateLimiter } from '@/utils/security'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/i18n/config'

/**
 * Optimized middleware following industry best practices
 * - Separated concerns (security, i18n, auth)
 * - Early returns for performance
 * - Proper composition pattern
 * - No code duplication
 */

// Route configurations
const PROTECTED_ROUTES = ['/showcase', '/profile', '/dashboard', '/admin']
const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
]
const LEGAL_ROUTES = ['/terms', '/privacy']

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

// Security utilities
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
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
  return LEGAL_ROUTES.includes(pathname)
}

function isSuspiciousRequest(request: NextRequest): boolean {
  if (env.isDevelopment) return false

  const userAgent = request.headers.get('user-agent') || ''

  const suspiciousPatterns = [
    /bot|crawler|spider|scraper/i,
    /curl|wget|python|php/i,
    /scanner|hack|exploit/i,
  ]

  return (
    !userAgent ||
    userAgent.length < 10 ||
    suspiciousPatterns.some(pattern => pattern.test(userAgent))
  )
}

function applyRateLimit(request: NextRequest): boolean {
  const clientIP = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const { pathname } = request.nextUrl

  // API routes have stricter limits
  if (pathname.startsWith('/api/')) {
    return rateLimiter.isRateLimited(
      `api:${clientIP}`,
      100, // 100 requests per 15 minutes
      15 * 60 * 1000
    )
  }

  // General routes
  return rateLimiter.isRateLimited(
    `general:${clientIP}:${userAgent}`,
    300, // 300 requests per 15 minutes
    15 * 60 * 1000
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
      'max-age=31536000; includeSubDomains; preload'
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
  const localeMatch = pathname.match(/^\/([a-z]{2})\/(.*)$/)
  const localePath = localeMatch ? `/${localeMatch[2]}` : pathname
  const locale = localeMatch ? localeMatch[1] : defaultLocale
  const url = pathname + request.nextUrl.search

  const isUserAuth = isAuthenticated(request)
  const isProtected = PROTECTED_ROUTES.some(
    route => localePath.startsWith(route) || localePath === route
  )
  const isAuth = AUTH_ROUTES.some(
    route => localePath.startsWith(route) || localePath === route
  )

  // Redirect unauthenticated users from protected routes
  if (isProtected && !isUserAuth) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirect', url)
    return addSecurityHeaders(NextResponse.redirect(loginUrl))
  }

  // Redirect authenticated users from auth routes
  if (isAuth && isUserAuth) {
    const showcaseUrl = new URL(`/${locale}/showcase`, request.url)
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

  // Handle legal documents first
  const legalResponse = handleLegalRoutes(request, pathname)
  if (legalResponse) return legalResponse

  // API routes: rate limiting only
  if (pathname.startsWith('/api/')) {
    if (applyRateLimit(request)) {
      console.warn(
        `API rate limit exceeded: ${getClientIP(request)} - ${pathname}`
      )
      return createRateLimitResponse()
    }
    return NextResponse.next()
  }

  // Security checks for non-API routes
  if (isSuspiciousRequest(request)) {
    console.warn(
      `Suspicious request blocked: ${getClientIP(request)} - ${pathname}`
    )
    return new NextResponse('Forbidden', { status: 403 })
  }

  if (applyRateLimit(request)) {
    console.warn(`Rate limit exceeded: ${getClientIP(request)} - ${pathname}`)
    return createRateLimitResponse()
  }

  // Apply i18n middleware
  const intlResponse = intlMiddleware(request)

  // Handle i18n redirects
  if (intlResponse?.status === 307 || intlResponse?.status === 308) {
    return addSecurityHeaders(intlResponse)
  }

  // Handle authentication
  const authResponse = handleAuthentication(request, pathname)
  if (authResponse) return authResponse

  // Default response with security headers
  const response = intlResponse || NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
