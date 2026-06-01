import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn (class name utility)', () => {
  it('returns a single class name unchanged', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('joins multiple class names with a space', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('filters out falsy values', () => {
    expect(cn('foo', undefined, null, false, 'bar')).toBe('foo bar')
  })

  it('merges conflicting Tailwind classes, keeping the last one', () => {
    // tailwind-merge resolves conflicts: p-4 wins over p-2
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('handles conditional classes via object syntax', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe(
      'text-red-500'
    )
  })

  it('returns empty string when no valid classes are provided', () => {
    expect(cn(undefined, null, false)).toBe('')
  })
})
