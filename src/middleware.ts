import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { env } from '@/config/env'
import { generateSecureToken, rateLimiter } from '@/utils/security'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/i18n/config'

/**
 * Enhanced middleware with comprehensive security headers and route protection
 * Implements OWASP security guidelines and industry best practices
 */

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

// Route configurations (without locale prefix)
const PROTECTED_ROUTES = ['/showcase', '/profile', '/dashboard', '/admin']
const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
]
const _PUBLIC_ROUTES = ['/', '/privacy', '/terms', '/about', '/contact']
const _API_ROUTES = ['/api']

// Generate a secure nonce for CSP
function generateNonce(): string {
  return generateSecureToken(16)
}

// Check if user is authenticated
function isAuthenticated(request: NextRequest): boolean {
  const authToken = request.cookies.get('auth_token')?.value
  return !!authToken && authToken.length > 0
}

// Apply rate limiting
function applyRateLimit(request: NextRequest): boolean {
  const clientIP =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // More restrictive rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return rateLimiter.isRateLimited(
      `api:${clientIP}`,
      100, // 100 requests per window
      15 * 60 * 1000 // 15 minutes
    )
  }

  // General rate limiting for all other routes
  return rateLimiter.isRateLimited(
    `general:${clientIP}:${userAgent}`,
    300, // 300 requests per window
    15 * 60 * 1000 // 15 minutes
  )
}

// Check for suspicious activity
function isSuspiciousRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''
  const _referer = request.headers.get('referer') || ''

  // Block common bot patterns (add more as needed)
  const suspiciousPatterns = [
    /bot|crawler|spider|scraper/i,
    /curl|wget|python|php/i,
    /scanner|hack|exploit/i,
  ]

  // Block requests with suspicious user agents
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    return true
  }

  // Block requests with no user agent
  if (!userAgent || userAgent.length < 10) {
    return true
  }

  return false
}

// Function to add security headers to any response
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Generate nonce for CSP
  const nonce = generateNonce()

  // Core security headers (OWASP recommendations)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')

  // Permissions Policy (formerly Feature Policy)
  response.headers.set(
    'Permissions-Policy',
    [
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
    ].join(', ')
  )

  // Strict Transport Security (HSTS) - Only in production
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
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https: blob:",
        "font-src 'self' https://fonts.gstatic.com",
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
        // Development CSP - more permissive for hot reload, etc.
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' https://fonts.gstatic.com",
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

  // Store nonce for use in components
  response.headers.set('X-Nonce', nonce)

  return response
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const url = pathname + search

  // Skip middleware for static files and internal Next.js routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Skip security checks for API routes and handle them with intl middleware
  if (pathname.startsWith('/api/')) {
    // Apply rate limiting for API routes
    if (applyRateLimit(request)) {
      const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
      console.warn(`Rate limit exceeded: ${clientIP} - ${pathname}`)
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '900', // 15 minutes
        },
      })
    }
    return NextResponse.next()
  }

  // Handle internationalization first
  const intlResponse = intlMiddleware(request)
  if (intlResponse) {
    // If intl middleware returns a response (redirect), apply security headers to it
    const secureResponse = addSecurityHeaders(intlResponse)
    return secureResponse
  }

  // Extract locale from pathname for route checking
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/'

  // Check for suspicious activity
  if (isSuspiciousRequest(request)) {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    console.warn(`Suspicious request blocked: ${clientIP} - ${pathname}`)
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Apply rate limiting
  if (applyRateLimit(request)) {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    console.warn(`Rate limit exceeded: ${clientIP} - ${pathname}`)
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes
      },
    })
  }

  // Authentication and routing logic (using path without locale)
  const isUserAuthenticated = isAuthenticated(request)
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathWithoutLocale.startsWith(route)
  )
  const isAuthRoute = AUTH_ROUTES.some(route =>
    pathWithoutLocale.startsWith(route)
  )

  // Get current locale from pathname
  const locale = pathname.match(/^\/([a-z]{2})/)?.[1] || defaultLocale

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isUserAuthenticated) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirect', url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && isUserAuthenticated) {
    const showcaseUrl = new URL(`/${locale}/showcase`, request.url)
    return NextResponse.redirect(showcaseUrl)
  }

  // Create response with security headers
  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and internal Next.js routes
     * This includes API routes for rate limiting and security headers
     * Updated to work with internationalized routing
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
