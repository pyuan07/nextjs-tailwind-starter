import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock @/lib/logger before importing security to avoid env validation side-effects
vi.mock('@/lib/logger', () => ({
  logger: {
    securityEvent: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}))

import {
  sanitizeHtml,
  sanitizeInput,
  generateSecureToken,
  validateRedirectUrl,
} from '@/utils/security'

describe('sanitizeHtml', () => {
  it('removes script tags from input', () => {
    const dirty = '<p>Hello</p><script>alert("xss")</script>'
    const result = sanitizeHtml(dirty)
    expect(result).not.toContain('<script')
    expect(result).not.toContain('alert')
  })

  it('preserves allowed tags for the basic level', () => {
    const input = '<p>Safe <strong>content</strong></p>'
    const result = sanitizeHtml(input, 'basic')
    expect(result).toContain('<p>')
    expect(result).toContain('<strong>')
  })

  it('strips disallowed tags in strict mode while blocking scripts', () => {
    // KEEP_CONTENT: false means content inside disallowed tags is also dropped.
    // <div> and <script> are not in the strict allowlist so everything inside
    // them is removed; only tags explicitly allowed survive (b, i, em, strong, p, br).
    const input = '<p>safe</p><div><script>bad()</script></div>'
    const result = sanitizeHtml(input, 'strict')
    expect(result).not.toContain('<script')
    expect(result).not.toContain('<div')
    expect(result).toContain('<p>')
  })

  it('returns empty string for empty input', () => {
    expect(sanitizeHtml('')).toBe('')
    expect(sanitizeHtml('   ')).toBe('')
  })

  it('returns empty string for non-string input', () => {
    // @ts-expect-error intentional bad input to test runtime guard
    expect(sanitizeHtml(null)).toBe('')
  })
})

describe('sanitizeInput', () => {
  it('removes angle brackets from input', () => {
    const result = sanitizeInput('Hello <world>')
    expect(result).not.toContain('<')
    expect(result).not.toContain('>')
  })

  it('strips javascript: protocol', () => {
    const result = sanitizeInput('javascript:alert(1)')
    expect(result).not.toMatch(/javascript:/i)
  })

  it('strips vbscript: protocol', () => {
    const result = sanitizeInput('vbscript:msgbox(1)')
    expect(result).not.toMatch(/vbscript:/i)
  })

  it('strips data: protocol', () => {
    const result = sanitizeInput('data:text/html,<h1>hi</h1>')
    expect(result).not.toMatch(/data:/i)
  })

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello')
  })

  it('truncates input to 1000 characters', () => {
    const long = 'a'.repeat(2000)
    expect(sanitizeInput(long).length).toBe(1000)
  })

  it('returns empty string for non-string input', () => {
    // @ts-expect-error intentional bad input to test runtime guard
    expect(sanitizeInput(42)).toBe('')
  })
})

describe('generateSecureToken', () => {
  it('returns a hex string of the correct length', () => {
    // Each byte becomes 2 hex chars, default length is 32 bytes => 64 chars
    const token = generateSecureToken()
    expect(token).toHaveLength(64)
    expect(token).toMatch(/^[0-9a-f]+$/)
  })

  it('respects a custom byte length', () => {
    const token = generateSecureToken(16)
    expect(token).toHaveLength(32)
  })

  it('produces a different value on each call', () => {
    const a = generateSecureToken()
    const b = generateSecureToken()
    expect(a).not.toBe(b)
  })
})

describe('validateRedirectUrl', () => {
  it('allows relative URLs starting with /', () => {
    expect(validateRedirectUrl('/dashboard')).toBe(true)
  })

  it('rejects protocol-relative URLs (//)', () => {
    expect(validateRedirectUrl('//evil.com')).toBe(false)
  })

  it('blocks javascript: protocol', () => {
    expect(validateRedirectUrl('javascript:alert(1)')).toBe(false)
  })

  it('blocks URLs from non-allowed domains when an allowlist is provided', () => {
    expect(validateRedirectUrl('https://evil.com/path', ['trusted.com'])).toBe(
      false
    )
  })

  it('allows URLs from explicitly allowed domains', () => {
    expect(
      validateRedirectUrl('https://trusted.com/path', ['trusted.com'])
    ).toBe(true)
  })
})
