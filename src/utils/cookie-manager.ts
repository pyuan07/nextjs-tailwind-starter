/**
 * Non-sensitive UI cookie manager.
 *
 * This manager is for non-sensitive UI cookies only (theme, locale, UI
 * preferences, etc.). Auth tokens are managed server-side via HttpOnly
 * cookies through the /api/auth/* route handlers.
 *
 * Do NOT store auth_token, refresh_token, or any session credentials here.
 */

export interface CookieOptions {
  expires?: Date | number // Date object or Unix timestamp
  maxAge?: number // seconds
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  // httpOnly is intentionally omitted: JS cannot set HttpOnly cookies.
}

export class CookieManager {
  /**
   * Set a UI cookie with comprehensive options.
   */
  static set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof window === 'undefined') return

    const {
      expires,
      maxAge,
      path = '/',
      domain,
      secure = location.protocol === 'https:',
      sameSite = 'Strict',
    } = options

    const parts: string[] = [`${name}=${encodeURIComponent(value)}`]

    if (expires) {
      const expiryDate = expires instanceof Date ? expires : new Date(expires)
      parts.push(`expires=${expiryDate.toUTCString()}`)
    }

    if (maxAge !== undefined) {
      parts.push(`max-age=${maxAge}`)
    }

    parts.push(`path=${path}`)

    if (domain) {
      parts.push(`domain=${domain}`)
    }

    if (secure) {
      parts.push('Secure')
    }

    parts.push(`SameSite=${sameSite}`)

    document.cookie = parts.join('; ')
  }

  /**
   * Get a cookie value by name.
   *
   * Uses slice(1).join('=') to correctly handle base64-encoded values that
   * contain '=' padding characters, avoiding the bug where split('=')[1]
   * would truncate a value like "abc==" to "abc".
   */
  static get(name: string): string | null {
    if (typeof window === 'undefined') return null

    try {
      const cookies = document.cookie.split(';')
      const prefix = `${name}=`
      const cookie = cookies.find(c => c.trim().startsWith(prefix))

      if (!cookie) return null

      // Preserve any '=' characters in the value (e.g. base64 padding)
      const encoded = cookie.trim().split('=').slice(1).join('=')
      return encoded ? decodeURIComponent(encoded) : null
    } catch (error) {
      console.error(`Failed to get cookie: ${name}`, error)
      return null
    }
  }

  /**
   * Delete a cookie by name.
   */
  static delete(
    name: string,
    options: Pick<CookieOptions, 'path' | 'domain'> = {}
  ): void {
    if (typeof window === 'undefined') return

    const { path = '/', domain } = options

    const parts: string[] = [
      `${name}=`,
      'expires=Thu, 01 Jan 1970 00:00:00 UTC',
      `path=${path}`,
    ]

    if (domain) {
      parts.push(`domain=${domain}`)
    }

    parts.push('SameSite=Strict')

    document.cookie = parts.join('; ')
  }

  /**
   * Check if a cookie exists.
   */
  static has(name: string): boolean {
    return this.get(name) !== null
  }

  /**
   * Get all cookies as an object.
   *
   * Uses slice(1).join('=') on each entry so that base64-padded values
   * are not truncated.
   */
  static getAll(): Record<string, string> {
    if (typeof window === 'undefined') return {}

    try {
      return document.cookie.split(';').reduce(
        (acc, cookie) => {
          const parts = cookie.trim().split('=')
          const name = parts[0]
          // Preserve any '=' characters in the value
          const value = parts.slice(1).join('=')
          if (name && value) {
            acc[name] = decodeURIComponent(value)
          }
          return acc
        },
        {} as Record<string, string>
      )
    } catch (error) {
      console.error('Failed to get all cookies', error)
      return {}
    }
  }

  /**
   * Clear all cookies (use with caution!).
   */
  static clear(): void {
    if (typeof window === 'undefined') return

    const cookies = this.getAll()
    Object.keys(cookies).forEach(name => this.delete(name))
  }
}
