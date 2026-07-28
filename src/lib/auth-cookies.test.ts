import { describe, expect, it } from 'vitest'
import { csrfTokensMatch, generateCsrfToken } from '@/lib/auth-cookies'

describe('csrfTokensMatch', () => {
  it('accepts an identical cookie/header pair', () => {
    const token = generateCsrfToken()
    expect(csrfTokensMatch(token, token)).toBe(true)
  })

  it('rejects a mismatched pair', () => {
    expect(csrfTokensMatch(generateCsrfToken(), generateCsrfToken())).toBe(
      false
    )
  })

  it('rejects when either half is missing', () => {
    const token = generateCsrfToken()
    expect(csrfTokensMatch(null, token)).toBe(false)
    expect(csrfTokensMatch(token, null)).toBe(false)
    expect(csrfTokensMatch(null, null)).toBe(false)
  })

  it('rejects empty strings, so a blank cookie never authorises a request', () => {
    expect(csrfTokensMatch('', '')).toBe(false)
    expect(csrfTokensMatch('', 'abc')).toBe(false)
  })

  it('rejects a token that only shares a prefix', () => {
    expect(csrfTokensMatch('abc123', 'abc124')).toBe(false)
    expect(csrfTokensMatch('abc123', 'abc12')).toBe(false)
  })

  it('rejects differing lengths without throwing', () => {
    expect(csrfTokensMatch('short', 'much-longer-token')).toBe(false)
  })

  it('generates a distinct token per call', () => {
    const tokens = new Set(Array.from({ length: 50 }, generateCsrfToken))
    expect(tokens.size).toBe(50)
  })
})
