import { logger } from '@/lib/logger'

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  // Basic HTML sanitization - in production, use DOMPurify
  return dirty
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
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
