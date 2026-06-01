/**
 * Application configuration constants
 * Extracted from magic numbers throughout the codebase
 */

// ============================================================================
// TOKEN CONFIGURATION
// ============================================================================

export const TOKEN_CONFIG = {
  /** Threshold to refresh access token (5 minutes before expiry) */
  REFRESH_THRESHOLD: 5 * 60 * 1000, // milliseconds

  /** Default access token lifetime (1 hour) */
  ACCESS_TOKEN_LIFETIME: 60 * 60 * 1000,

  /** Default refresh token lifetime (7 days) */
  REFRESH_TOKEN_LIFETIME: 7 * 24 * 60 * 60 * 1000,

  /** Maximum retry attempts for token refresh */
  MAX_REFRESH_RETRIES: 3,
} as const

// ============================================================================
// RATE LIMITING CONFIGURATION
// ============================================================================

export const RATE_LIMITS = {
  /** API route rate limits */
  API: {
    requests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  /** General route rate limits */
  GENERAL: {
    requests: 300,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  /** Auth route rate limits (stricter) */
  AUTH: {
    requests: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
} as const

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  /** Default request timeout */
  TIMEOUT: 30000, // 30 seconds

  /** Retry configuration */
  RETRY: {
    attempts: 3,
    delay: 1000, // 1 second
    backoff: 2, // exponential backoff multiplier
  },
} as const

// ============================================================================
// ERROR BOUNDARY CONFIGURATION
// ============================================================================

export const ERROR_BOUNDARY_CONFIG = {
  /** Maximum retry attempts before showing permanent error */
  MAX_RETRIES: 3,

  /** Delay before auto-retry (milliseconds) */
  RETRY_DELAY: 1000,
} as const

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================

export const SECURITY_CONFIG = {
  /** Maximum file upload size (5MB) */
  MAX_FILE_SIZE: 5 * 1024 * 1024,

  /** Allowed image MIME types */
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

  /** Maximum input length for sanitization */
  MAX_INPUT_LENGTH: 1000,

  /** Minimum password length */
  MIN_PASSWORD_LENGTH: 8,

  /** HSTS max age (1 year) */
  HSTS_MAX_AGE: 31536000,
} as const

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  /** Refresh token in httpOnly cookie */
  REFRESH_TOKEN: 'refresh_token',

  /** Auth token for middleware */
  AUTH_TOKEN: 'auth_token',

  /** Theme preference */
  THEME: 'theme',

  /** Language preference */
  LANGUAGE: 'language',
} as const

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const UI_CONFIG = {
  /** Toast notification duration (milliseconds) */
  TOAST_DURATION: 3000,

  /** Debounce delay for search inputs (milliseconds) */
  SEARCH_DEBOUNCE: 300,

  /** Throttle delay for scroll events (milliseconds) */
  SCROLL_THROTTLE: 100,

  /** Animation duration (milliseconds) */
  ANIMATION_DURATION: 200,

  /** Mobile breakpoint (pixels) */
  MOBILE_BREAKPOINT: 768,
} as const

// ============================================================================
// VALIDATION PATTERNS
// ============================================================================

export const VALIDATION = {
  /** Email regex pattern */
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** Password minimum length */
  PASSWORD_MIN_LENGTH: 8,

  /** URL regex pattern */
  URL_REGEX: /^https?:\/\/.+/,
} as const

// ============================================================================
// ROUTE CONFIGURATIONS
// ============================================================================

export const ROUTES = {
  /** Protected routes requiring authentication */
  PROTECTED: ['/showcase', '/profile', '/dashboard', '/admin'] as const,

  /** Authentication routes (redirect if already logged in) */
  AUTH: ['/login', '/register', '/forgot-password', '/reset-password'] as const,

  /** Legal routes (no i18n prefix) */
  LEGAL: ['/terms', '/privacy'] as const,

  /** Public routes (no authentication required) */
  PUBLIC: ['/', '/about', '/contact'] as const,

  /** Default redirect for authenticated users (e.g. after login or when accessing auth routes) */
  DEFAULT_AUTHENTICATED: '/showcase',

  /** Default redirect for unauthenticated users (e.g. when accessing protected routes) */
  DEFAULT_UNAUTHENTICATED: '/login',
} as const

// ============================================================================
// DEMO CONFIGURATION
// ============================================================================

export const DEMO_CONFIG = {
  /** Demo user credentials */
  DEMO_USER: {
    email: 'demo@example.com',
    // WARNING: Demo credentials only. Remove DEMO_CONFIG entirely before production deployment.
    // Never use plaintext passwords in production — use bcrypt or argon2 hashing.
    password: 'password',
    name: 'Demo User',
    id: 1,
    role: 'user' as const,
    lang: 'en' as const,
    isEmailVerified: true,
  },
} as const

// ============================================================================
// HELPER TYPE EXPORTS
// ============================================================================

export type ProtectedRoute = (typeof ROUTES.PROTECTED)[number]
export type AuthRoute = (typeof ROUTES.AUTH)[number]
export type LegalRoute = (typeof ROUTES.LEGAL)[number]
export type PublicRoute = (typeof ROUTES.PUBLIC)[number]

// ============================================================================
// FEATURE FLAGS
// ============================================================================

/**
 * Server-side feature flag — never exposed to the client bundle.
 * Controls whether /api/auth/* route handlers call the real backend.
 * Set USE_REAL_API=true in .env.local (or your deployment platform) when
 * connecting to a real API server.
 */
export const USE_REAL_API_SERVER = process.env.USE_REAL_API === 'true'

/**
 * Client-side feature flag — exposed via NEXT_PUBLIC_ prefix.
 * Controls whether auth.service.ts calls the real backend from the browser.
 * Set NEXT_PUBLIC_USE_REAL_API=true in .env.local alongside USE_REAL_API=true.
 */
export const USE_REAL_API_CLIENT =
  process.env.NEXT_PUBLIC_USE_REAL_API === 'true'
