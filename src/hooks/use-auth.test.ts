import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { User } from '@/types/api'

// ---------------------------------------------------------------------------
// Shared mock state -- mutated per-test via helpers below
// ---------------------------------------------------------------------------
const mockState = {
  user: null as User | null,
  isAuthenticated: false,
  isLoading: false,
  error: null as string | null,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
  clearError: vi.fn(),
  refreshAuth: vi.fn(),
}

// Mock the Zustand store so no real auth logic or network calls occur
vi.mock('@/stores', () => ({
  useAuthStore: (selector: (state: typeof mockState) => unknown) =>
    selector(mockState),
}))

// Mock zustand shallow so it is a simple identity pass-through in tests
vi.mock('zustand/react/shallow', () => ({
  useShallow: (fn: unknown) => fn,
}))

import { useAuth, useAuthStatus } from '@/hooks/use-auth'

const sampleUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  lang: 'en',
  isEmailVerified: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

function resetMockState() {
  mockState.user = null
  mockState.isAuthenticated = false
  mockState.isLoading = false
  mockState.error = null
  mockState.login.mockReset()
  mockState.register.mockReset()
  mockState.logout.mockReset()
  mockState.updateProfile.mockReset()
  mockState.clearError.mockReset()
  mockState.refreshAuth.mockReset()
}

describe('useAuth', () => {
  beforeEach(resetMockState)

  it('returns null user when not authenticated', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('returns the user object when authenticated', () => {
    mockState.user = sampleUser
    mockState.isAuthenticated = true

    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toEqual(sampleUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('reflects loading state from the store', () => {
    mockState.isLoading = true

    const { result } = renderHook(() => useAuth())
    expect(result.current.isLoading).toBe(true)
  })

  it('reflects error state from the store', () => {
    mockState.error = 'Invalid credentials'

    const { result } = renderHook(() => useAuth())
    expect(result.current.error).toBe('Invalid credentials')
  })

  it('exposes all action callbacks from the store', () => {
    const { result } = renderHook(() => useAuth())
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
    expect(typeof result.current.register).toBe('function')
    expect(typeof result.current.updateProfile).toBe('function')
    expect(typeof result.current.clearError).toBe('function')
    expect(typeof result.current.refreshAuth).toBe('function')
  })
})

describe('useAuthStatus', () => {
  beforeEach(resetMockState)

  it('returns isAuthenticated false when not logged in', () => {
    const { result } = renderHook(() => useAuthStatus())
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('returns isAuthenticated true when logged in', () => {
    mockState.isAuthenticated = true

    const { result } = renderHook(() => useAuthStatus())
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('returns isLoading from the store', () => {
    mockState.isLoading = true

    const { result } = renderHook(() => useAuthStatus())
    expect(result.current.isLoading).toBe(true)
  })
})
