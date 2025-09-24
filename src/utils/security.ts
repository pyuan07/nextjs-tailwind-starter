import { logger } from '@/lib/logger'
import DOMPurify from 'dompurify'

/**
 * DOMPurify configuration for different sanitization levels
 */
export const SANITIZE_CONFIGS = {
  // Strict: Only allow basic text formatting
  strict: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'] as string[],
    ALLOWED_ATTR: [] as string[],
    KEEP_CONTENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
  },

  // Basic: Allow common safe HTML elements
  basic: {
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'ul',
      'ol',
      'li',
      'blockquote',
      'code',
      'pre',
    ] as string[],
    ALLOWED_ATTR: ['class'] as string[],
    KEEP_CONTENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
  },

  // Rich: Allow more elements for rich content
  rich: {
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'del',
      'ul',
      'ol',
      'li',
      'blockquote',
      'code',
      'pre',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'div',
      'span',
    ] as string[],
    ALLOWED_ATTR: [
      'href',
      'title',
      'alt',
      'src',
      'width',
      'height',
      'class',
      'id',
      'target',
      'rel',
    ] as string[],
    KEEP_CONTENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
  },
}

/**
 * Sanitize HTML to prevent XSS attacks using DOMPurify
 * @param dirty - The HTML string to sanitize
 * @param level - Sanitization level: 'strict' | 'basic' | 'rich'
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(
  dirty: string,
  level: keyof typeof SANITIZE_CONFIGS = 'basic'
): string {
  if (typeof dirty !== 'string') {
    logger.securityEvent('Invalid HTML input type', { inputType: typeof dirty })
    return ''
  }

  if (!dirty.trim()) {
    return ''
  }

  try {
    // Use DOMPurify with configuration for the specified level
    const config = SANITIZE_CONFIGS[level]
    const clean = DOMPurify.sanitize(dirty, config)

    // Log if content was sanitized
    if (clean !== dirty) {
      logger.securityEvent('HTML was sanitized', {
        level,
        originalLength: dirty.length,
        sanitizedLength: clean.length,
        hasScript: dirty.toLowerCase().includes('<script'),
        hasOnEvents: /\son\w+\s*=/i.test(dirty),
        hasJavaScript: /javascript:/i.test(dirty),
      })
    }

    return clean
  } catch (error) {
    logger.error('HTML sanitization failed', error as Error, {
      inputLength: dirty.length,
      level,
    })

    // Fallback to basic text sanitization
    return dirty
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }
}

/**
 * Sanitize HTML for safe display in React components
 * Returns an object compatible with dangerouslySetInnerHTML
 * @param dirty - The HTML string to sanitize
 * @param level - Sanitization level
 * @returns Object with __html property for dangerouslySetInnerHTML
 */
export function sanitizeForReact(
  dirty: string,
  level: keyof typeof SANITIZE_CONFIGS = 'basic'
): { __html: string } {
  return { __html: sanitizeHtml(dirty, level) }
}

/**
 * Validate and sanitize user input
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    logger.securityEvent('Invalid input type received', {
      inputType: typeof input,
    })
    return ''
  }

  // Remove potentially dangerous characters
  const sanitized = input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .substring(0, 1000) // Limit length

  if (sanitized !== input) {
    logger.securityEvent('Input was sanitized', {
      original: input.substring(0, 100),
      sanitized: sanitized.substring(0, 100),
    })
  }

  return sanitized
}

/**
 * Rate limiting store
 */
interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private defaultLimit = 100 // requests per window
  private defaultWindow = 15 * 60 * 1000 // 15 minutes

  /**
   * Check if request should be rate limited
   */
  isRateLimited(
    identifier: string,
    limit: number = this.defaultLimit,
    windowMs: number = this.defaultWindow
  ): boolean {
    const now = Date.now()
    const entry = this.store.get(identifier)

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      this.cleanup()
    }

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.store.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      })
      return false
    }

    if (entry.count >= limit) {
      logger.securityEvent('Rate limit exceeded', {
        identifier,
        count: entry.count,
        limit,
        resetTime: entry.resetTime,
      })
      return true
    }

    // Increment counter
    entry.count += 1
    return false
  }

  /**
   * Get remaining requests for identifier
   */
  getRemaining(identifier: string, limit: number = this.defaultLimit): number {
    const entry = this.store.get(identifier)
    if (!entry || Date.now() > entry.resetTime) {
      return limit
    }
    return Math.max(0, limit - entry.count)
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

export const rateLimiter = new RateLimiter()

/**
 * Generate secure random string
 */
export function generateSecureToken(length: number = 32): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(
      ''
    )
  }

  // Fallback for server-side
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Validate URL to prevent open redirect attacks
 */
export function validateRedirectUrl(
  url: string,
  allowedDomains: string[] = []
): boolean {
  try {
    const parsed = new URL(url)

    // Only allow relative URLs or URLs from allowed domains
    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
      logger.securityEvent('Dangerous redirect URL blocked', { url })
      return false
    }

    if (
      allowedDomains.length > 0 &&
      !allowedDomains.includes(parsed.hostname)
    ) {
      logger.securityEvent('Redirect to unauthorized domain blocked', {
        url,
        hostname: parsed.hostname,
        allowedDomains,
      })
      return false
    }

    return true
  } catch {
    // Invalid URL
    return url.startsWith('/') && !url.startsWith('//')
  }
}

/**
 * Content Security Policy headers
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'child-src': ["'self'"],
  'worker-src': ["'self'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
}

/**
 * Security headers for API responses
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif'],
  maxSize: number = 5 * 1024 * 1024 // 5MB
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    logger.securityEvent('Invalid file type uploaded', {
      fileName: file.name,
      fileType: file.type,
      allowedTypes,
    })
    return { valid: false, error: 'Invalid file type' }
  }

  if (file.size > maxSize) {
    logger.securityEvent('File size exceeds limit', {
      fileName: file.name,
      fileSize: file.size,
      maxSize,
    })
    return { valid: false, error: 'File size too large' }
  }

  return { valid: true }
}

/**
 * Hash password client-side (for additional security layer)
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    // Fallback - don't hash on server side
    return password
  }

  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hash = await window.crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hash))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch (error) {
    logger.error('Failed to hash password', error as Error)
    return password
  }
}
