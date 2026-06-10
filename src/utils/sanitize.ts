import DOMPurify from 'dompurify'
import { logger } from '@/lib/logger'
import { SECURITY_CONFIG } from '@/constants'

export const SANITIZE_CONFIGS = {
  strict: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'] as string[],
    ALLOWED_ATTR: [] as string[],
    KEEP_CONTENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
  },

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

export function sanitizeHtml(
  dirty: string,
  level: keyof typeof SANITIZE_CONFIGS = 'basic'
): string {
  if (typeof dirty !== 'string') {
    logger.securityEvent('Invalid HTML input type', { inputType: typeof dirty })
    return ''
  }

  if (!dirty.trim()) return ''

  try {
    const clean = DOMPurify.sanitize(dirty, SANITIZE_CONFIGS[level])

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

    return dirty
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }
}

export function sanitizeForReact(
  dirty: string,
  level: keyof typeof SANITIZE_CONFIGS = 'basic'
): { __html: string } {
  return { __html: sanitizeHtml(dirty, level) }
}

const DANGEROUS_PROTOCOLS = /(?:javascript|vbscript|data):/gi

function stripDangerousProtocols(input: string): string {
  let current = input
  let prev = ''
  while (current !== prev) {
    prev = current
    current = current.replace(DANGEROUS_PROTOCOLS, '')
  }
  return current
}

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  if (!input.trim()) return ''

  // Strip dangerous protocols anywhere in the string (not just at the start),
  // looping until stable to handle nested obfuscation like javajavascript:script:.
  let sanitized = sanitizeHtml(stripDangerousProtocols(input))

  // Decode percent-encoding once to catch %6aavascript: etc., then re-strip.
  try {
    const decoded = decodeURIComponent(sanitized)
    if (decoded !== sanitized) {
      sanitized = sanitizeHtml(stripDangerousProtocols(decoded))
    }
  } catch {
    // malformed URI sequence — current value is fine
  }

  const result = sanitized.trim().substring(0, SECURITY_CONFIG.MAX_INPUT_LENGTH)

  if (result !== input.trim().substring(0, SECURITY_CONFIG.MAX_INPUT_LENGTH)) {
    logger.securityEvent('Input was sanitized', {
      original: input.substring(0, 100),
      sanitized: result.substring(0, 100),
    })
  }

  return result
}
