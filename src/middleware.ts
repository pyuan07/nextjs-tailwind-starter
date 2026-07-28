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

/**
 * Resolve the client IP used to key rate limiting.
 *
 * X-Forwarded-For is client-controlled: anyone can send
 * `X-Forwarded-For: <random>` and, if we read the LEFT-most entry, mint a
 * fresh rate-limit bucket on every request. Each proxy APPENDS the address it
 * received the request from, so the RIGHT-most entries are the trustworthy
 * ones — the last is always written by our own nearest proxy.
 *
 * With N trusted proxies in front of the app, the real client sits at
 * index (length - N). Configure N via TRUSTED_PROXY_HOPS (default 1).
 * Platform headers below are set by the edge itself and cannot be spoofed,
 * so they win when present.
 */
function getClientIP(request: NextRequest): string {
  const platformIP =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-vercel-forwarded-for') ??
    (request as unknown as { ip?: string }).ip

  if (platformIP) return platformIP.trim()

  const hops = env.TRUSTED_PROXY_HOPS
  if (hops === 0) return 'unknown'

  const chain = (request.headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)

  if (chain.length === 0) return 'unknown'

  return chain[Math.max(0, chain.length - hops)] ?? 'unknown'
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

/** Origin of the external API server, or '' when it is same-origin/unset. */
function apiOrigin(): string {
  try {
    return new URL(env.API_BASE_URL).origin
  } catch {
    return ''
  }
}

/** Ingest origin of a Sentry DSN, so error reporting is not blocked by CSP. */
function sentryOrigin(dsn: string): string {
  try {
    return new URL(dsn).origin
  } catch {
    return ''
  }
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

  // Origins the browser is allowed to open connections to. Kept to an explicit
  // allowlist rather than a blanket `https:` — with `https:` any injected script
  // can POST stolen data to an attacker-controlled host, which defeats much of
  // the point of having a CSP.
  const connectSrc = [
    "'self'",
    apiOrigin(),
    env.SENTRY_DSN ? sentryOrigin(env.SENTRY_DSN) : '',
  ]
    .filter(Boolean)
    .join(' ')

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
        `connect-src ${connectSrc}`,
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
        // ws:/wss: are required for the dev-server HMR socket.
        `connect-src ${connectSrc} ws: wss:`,
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
      return addSecurityHeaders(createRateLimitResponse())
    }
    // API responses need the same hardening as pages — notably nosniff, so a
    // JSON body is never content-sniffed into something executable.
    return addSecurityHeaders(NextResponse.next())
  }

  if (pathname === '/') {
    return addSecurityHeaders(intlMiddleware(request))
  }

  if (applyRateLimit(request)) {
    console.warn(`Rate limit exceeded: ${getClientIP(request)} - ${pathname}`)
    return addSecurityHeaders(createRateLimitResponse())
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
