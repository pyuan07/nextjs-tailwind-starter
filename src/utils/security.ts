/**
 * Edge-safe security utilities — no DOM or DOMPurify dependencies.
 * Safe to import from middleware (Edge Runtime) and server-side code.
 *
 * For HTML sanitization (DOMPurify) use @/utils/sanitize instead.
 */

// ── Rate limiter ──────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private defaultLimit = 100
  private defaultWindow = 15 * 60 * 1000

  isRateLimited(
    identifier: string,
    limit: number = this.defaultLimit,
    windowMs: number = this.defaultWindow
  ): boolean {
    const now = Date.now()
    const entry = this.store.get(identifier)

    if (Math.random() < 0.01) this.cleanup()

    if (!entry || now > entry.resetTime) {
      this.store.set(identifier, { count: 1, resetTime: now + windowMs })
      return false
    }

    if (entry.count >= limit) {
      console.warn('[rate-limit] exceeded', {
        identifier,
        count: entry.count,
        limit,
      })
      return true
    }

    entry.count += 1
    return false
  }

  getRemaining(identifier: string, limit: number = this.defaultLimit): number {
    const entry = this.store.get(identifier)
    if (!entry || Date.now() > entry.resetTime) return limit
    return Math.max(0, limit - entry.count)
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) this.store.delete(key)
    }
  }
}

export const rateLimiter = new RateLimiter()

// ── Token generation ──────────────────────────────────────────────────────────

/** Generates a cryptographically random hex string. Works in browser, Node, and Edge Runtime. */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// ── URL validation ────────────────────────────────────────────────────────────

export function validateRedirectUrl(
  url: string,
  allowedDomains: string[] = []
): boolean {
  try {
    const parsed = new URL(url)

    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
      console.warn('[security] dangerous redirect URL blocked', { url })
      return false
    }

    if (
      allowedDomains.length > 0 &&
      !allowedDomains.includes(parsed.hostname)
    ) {
      console.warn('[security] redirect to unauthorized domain blocked', {
        url,
        hostname: parsed.hostname,
      })
      return false
    }

    return true
  } catch {
    return url.startsWith('/') && !url.startsWith('//')
  }
}
