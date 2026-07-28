/**
 * Edge-safe security utilities — no DOM or DOMPurify dependencies.
 * Safe to import from middleware (Edge Runtime) and server-side code.
 *
 * For HTML sanitization (DOMPurify) use @/utils/sanitize instead.
 */

// ── Rate limiter ──────────────────────────────────────────────────────────────
//
// NOTE: This limiter stores counters in a process-local Map. On serverless /
// multi-instance deployments each instance keeps its own counters, so the
// effective limit becomes (limit × instance-count) and counters reset on cold
// start. For production-grade distributed rate limiting, back this with a
// shared store such as Upstash Redis (@upstash/ratelimit).

interface RateLimitEntry {
  count: number
  resetTime: number
}

/**
 * Upper bound on tracked identifiers. Without a cap the store is a memory
 * growth vector: every distinct key allocates an entry, and an attacker who
 * can vary the rate-limit key (e.g. via a spoofable forwarded-for header) can
 * grow it without limit. On overflow we evict expired entries first and, if
 * that is not enough, drop the oldest-expiring entries.
 */
const MAX_TRACKED_IDENTIFIERS = 10_000

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
      if (this.store.size >= MAX_TRACKED_IDENTIFIERS) this.evict()
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

  /**
   * Make room when the store hits its cap. Expired entries go first; if the
   * store is still full they are all live, so drop the ones closest to
   * expiring — those buckets are about to reset anyway.
   */
  private evict(): void {
    this.cleanup()
    if (this.store.size < MAX_TRACKED_IDENTIFIERS) return

    const byExpiry = [...this.store.entries()].sort(
      (a, b) => a[1].resetTime - b[1].resetTime
    )
    const dropCount = Math.ceil(MAX_TRACKED_IDENTIFIERS / 10)
    for (const [key] of byExpiry.slice(0, dropCount)) {
      this.store.delete(key)
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
