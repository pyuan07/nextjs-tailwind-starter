import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '@/stores/auth-store'
import type { User } from '@/types/api'

// vi.mock is hoisted before module initialisation, so all fixture values
// must be defined inline inside each factory to avoid the temporal dead zone.

vi.mock('@/utils/auth/tokenManager', () => ({
  tokenManager: {
    login: vi.fn(),
    logout: vi.fn(),
    initSession: vi.fn(),
    getUser: vi.fn(),
    refresh: vi.fn(),
    isAuthenticated: vi.fn(),
  },
}))

vi.mock('@/services', () => ({
  authService: {
    register: vi.fn(),
    updateProfile: vi.fn(),
  },
}))

const mockUser: User = {
  id: '1',
  email: 'test@test.com',
  name: 'Test User',
  role: 'user',
  lang: 'en',
  isEmailVerified: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

describe('auth-store', () => {
  beforeEach(async () => {
    // Reset Zustand state
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    // Re-apply mock implementations after clearAllMocks wipes them
    const { tokenManager } = await import('@/utils/auth/tokenManager')
    vi.mocked(tokenManager.login).mockResolvedValue(mockUser)
    vi.mocked(tokenManager.logout).mockResolvedValue(undefined)
    vi.mocked(tokenManager.initSession).mockResolvedValue(undefined)
    vi.mocked(tokenManager.getUser).mockReturnValue(mockUser)
    vi.mocked(tokenManager.refresh).mockResolvedValue(true)
    vi.mocked(tokenManager.isAuthenticated).mockReturnValue(true)
    const { authService } = await import('@/services')
    vi.mocked(authService.register).mockResolvedValue({
      success: true,
      message: 'ok',
      data: { user: mockUser, tokens: {} as never },
    })
    vi.mocked(authService.updateProfile).mockResolvedValue({
      success: true,
      message: 'ok',
      data: mockUser,
    })
  })

  describe('login', () => {
    it('sets user and isAuthenticated on successful login', async () => {
      await useAuthStore
        .getState()
        .login({ email: 'test@test.com', password: 'password123' })
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toEqual(mockUser)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('sets error and throws when tokenManager.login rejects', async () => {
      const { tokenManager } = await import('@/utils/auth/tokenManager')
      vi.mocked(tokenManager.login).mockRejectedValueOnce(
        new Error('Bad credentials')
      )
      await expect(
        useAuthStore
          .getState()
          .login({ email: 'bad@test.com', password: 'wrong' })
      ).rejects.toThrow('Bad credentials')
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().error).toBe('Bad credentials')
    })
  })

  describe('logout', () => {
    it('clears user and isAuthenticated on logout', async () => {
      const { tokenManager } = await import('@/utils/auth/tokenManager')
      // Simulate post-logout state: session is gone, so refreshAuth won't re-authenticate
      vi.mocked(tokenManager.getUser).mockReturnValue(null)
      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      await useAuthStore.getState().logout()
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('refreshAuth', () => {
    it('restores session when tokenManager returns a user', async () => {
      await useAuthStore.getState().refreshAuth()
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toEqual(mockUser)
    })

    it('clears auth state when tokenManager.getUser returns null', async () => {
      const { tokenManager } = await import('@/utils/auth/tokenManager')
      vi.mocked(tokenManager.getUser).mockReturnValueOnce(null)
      await useAuthStore.getState().refreshAuth()
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
    })
  })

  describe('clearError', () => {
    it('resets error to null', () => {
      useAuthStore.setState({ error: 'some error' })
      useAuthStore.getState().clearError()
      expect(useAuthStore.getState().error).toBeNull()
    })
  })
})
