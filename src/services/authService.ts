// Industry-standard auth service with realistic token management
import { tokenManager } from '@/utils/auth/tokenManager'
import type { LoginRequest, RegisterRequest, TokenPair } from '@/types/api/auth'
import type { User } from '@/types/entities'

// Generate realistic tokens with expiry
function generateTokenPair(): TokenPair {
  const now = Date.now()
  const randomId = Math.random().toString(36).substr(2, 9)

  return {
    accessToken: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.${btoa(
      JSON.stringify({
        sub: 'demo-user',
        iat: Math.floor(now / 1000),
        exp: Math.floor((now + 15 * 60 * 1000) / 1000), // 15 minutes (production standard)
        jti: randomId,
      })
    )}`,
    refreshToken: `rt_${Date.now()}_${randomId}`,
    accessTokenExpiry: now + 15 * 60 * 1000, // 15 minutes
    refreshTokenExpiry: now + 7 * 24 * 60 * 60 * 1000, // 7 days
    tokenType: 'Bearer',
  }
}

// Industry-standard auth service with proper token management
export const authService = {
  async login(credentials: LoginRequest) {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // })

      // Demo validation - replace with API response validation
      if (
        credentials.email === 'demo@example.com' &&
        credentials.password === 'password'
      ) {
        const tokens = generateTokenPair()

        // Store tokens securely
        tokenManager.storeTokens(tokens)

        return {
          success: true,
          message: 'Login successful',
          data: {
            user: { id: 1, name: 'Demo User', email: 'demo@example.com' },
            tokens,
          },
        }
      }

      throw new Error('Invalid credentials')
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed')
    }
  },

  async register(userData: RegisterRequest) {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // })

      // Demo registration - always succeeds
      const tokens = generateTokenPair()

      // Store tokens securely
      tokenManager.storeTokens(tokens)

      return {
        success: true,
        message: 'Registration successful',
        data: {
          user: { id: 2, name: userData.name, email: userData.email },
          tokens,
        },
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Registration failed'
      )
    }
  },

  async logout() {
    try {
      // TODO: Add API call to invalidate tokens on server
      // await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${await tokenManager.getValidAccessToken()}` }
      // })

      // Clear tokens locally
      tokenManager.clearTokens()
      return { success: true, message: 'Logged out successfully' }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Logout failed')
    }
  },

  async getProfile() {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error('Not authenticated')
      }

      // TODO: Replace with actual API call
      // const token = await tokenManager.getValidAccessToken()
      // const response = await fetch('/api/auth/profile', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })

      // Demo profile data
      return {
        success: true,
        message: 'Profile retrieved',
        data: { id: 1, name: 'Demo User', email: 'demo@example.com' },
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to get profile'
      )
    }
  },

  async updateProfile(updates: Partial<User>) {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error('Not authenticated')
      }

      // TODO: Replace with actual API call
      // const token = await tokenManager.getValidAccessToken()
      // const response = await fetch('/api/auth/profile', {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(updates)
      // })

      // Demo update - always succeeds
      return {
        success: true,
        message: 'Profile updated',
        data: {
          id: 1,
          name: updates.name || 'Demo User',
          email: updates.email || 'demo@example.com',
        },
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Update failed')
    }
  },

  async refreshToken() {
    try {
      const newTokens = await tokenManager.refreshAccessToken()
      if (!newTokens) {
        throw new Error('Failed to refresh token')
      }

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: { tokens: newTokens },
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Token refresh failed'
      )
    }
  },

  isAuthenticated: () => tokenManager.isAuthenticated(),

  getTokenStatus() {
    const validation = tokenManager.validateAccessToken()
    return {
      isAuthenticated: tokenManager.isAuthenticated(),
      tokenValidation: validation,
    }
  },
}
