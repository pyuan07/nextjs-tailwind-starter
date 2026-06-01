/**
 * User Service
 * Provides CRUD operations for user management.
 *
 * CONFIGURATION:
 * - Currently using in-memory mock data for standalone operation
 * - Set NEXT_PUBLIC_USE_REAL_API=true in .env.local to switch to real API calls
 */

import { logger } from '@/lib/logger'
// Real-API stubs (uncomment and use when NEXT_PUBLIC_USE_REAL_API=true):
// import { api } from '@/lib/api'
// import { API_ENDPOINTS } from '@/types/api'
import type { User, ServiceResponse, VoidServiceResponse } from '@/types/api'

const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true'
// When USE_REAL_API is true, replace mock logic with real API calls.

export interface CreateUserInput {
  name: string
  email: string
  role: User['role']
  lang?: User['lang']
  avatar?: string | null
  isEmailVerified?: boolean
}

const INITIAL_MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    lang: 'en',
    role: 'user',
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: null,
    lang: 'en',
    role: 'admin',
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: null,
    lang: 'en',
    role: 'user',
    isEmailVerified: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

let mockUsersMap: Map<number, User> = new Map(
  INITIAL_MOCK_USERS.map(u => [Number(u.id), u])
)

/** Reset mock store to initial state (useful for testing). */
export function resetMockUsers(): void {
  mockUsersMap = new Map(INITIAL_MOCK_USERS.map(u => [Number(u.id), u]))
}

export const userService = {
  async getUsers(): Promise<ServiceResponse<User[]>> {
    if (USE_REAL_API) {
      throw new Error(
        'Not implemented: connect to real API endpoint for getUsers'
      )
    }
    try {
      logger.info('Fetching all users (mock)')
      const users = Array.from(mockUsersMap.values())
      logger.info('Users retrieved', { count: users.length })
      return {
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch users'
      logger.error(
        'getUsers failed',
        error instanceof Error ? error : new Error(message)
      )
      return { success: false, message, errors: [message] }
    }
  },

  async getUserById(id: number | string): Promise<ServiceResponse<User>> {
    if (USE_REAL_API) {
      throw new Error(
        'Not implemented: connect to real API endpoint for getUserById'
      )
    }
    try {
      logger.info('Fetching user by id (mock)', { id: String(id) })
      const user = mockUsersMap.get(Number(id))
      if (!user) {
        const message = 'User not found'
        return { success: false, message, errors: [message] }
      }
      logger.info('User retrieved', { userId: String(user.id) })
      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch user'
      logger.error(
        'getUserById failed',
        error instanceof Error ? error : new Error(message),
        { id: String(id) }
      )
      return { success: false, message, errors: [message] }
    }
  },

  async createUser(input: CreateUserInput): Promise<ServiceResponse<User>> {
    if (USE_REAL_API) {
      throw new Error(
        'Not implemented: connect to real API endpoint for createUser'
      )
    }
    try {
      logger.info('Creating user (mock)', { email: input.email })
      const emailTaken = Array.from(mockUsersMap.values()).some(
        u => u.email === input.email
      )
      if (emailTaken) {
        const message = 'A user with this email already exists'
        return { success: false, message, errors: [message] }
      }
      const nextId =
        mockUsersMap.size > 0
          ? Math.max(...Array.from(mockUsersMap.keys())) + 1
          : 1
      const now = new Date().toISOString()
      const newUser: User = {
        id: nextId,
        name: input.name,
        email: input.email,
        role: input.role,
        lang: input.lang ?? 'en',
        avatar: input.avatar ?? null,
        isEmailVerified: input.isEmailVerified ?? false,
        createdAt: now,
        updatedAt: now,
      }
      mockUsersMap = new Map([...mockUsersMap, [nextId, newUser]])
      logger.info('User created', { userId: String(newUser.id) })
      return {
        success: true,
        message: 'User created successfully',
        data: newUser,
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create user'
      logger.error(
        'createUser failed',
        error instanceof Error ? error : new Error(message),
        { email: input.email }
      )
      return { success: false, message, errors: [message] }
    }
  },

  async updateUser(
    id: number | string,
    updates: Partial<User>
  ): Promise<ServiceResponse<User>> {
    if (USE_REAL_API) {
      throw new Error(
        'Not implemented: connect to real API endpoint for updateUser'
      )
    }
    try {
      logger.info('Updating user (mock)', { id: String(id) })
      const numId = Number(id)
      const existing = mockUsersMap.get(numId)
      if (!existing) {
        const message = 'User not found'
        return { success: false, message, errors: [message] }
      }
      const updatedUser: User = {
        ...existing,
        ...updates,
        id: existing.id,
        updatedAt: new Date().toISOString(),
      }
      mockUsersMap = new Map([...mockUsersMap, [numId, updatedUser]])
      logger.info('User updated', { userId: String(updatedUser.id) })
      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update user'
      logger.error(
        'updateUser failed',
        error instanceof Error ? error : new Error(message),
        { id: String(id) }
      )
      return { success: false, message, errors: [message] }
    }
  },

  async deleteUser(id: number | string): Promise<VoidServiceResponse> {
    if (USE_REAL_API) {
      throw new Error(
        'Not implemented: connect to real API endpoint for deleteUser'
      )
    }
    try {
      logger.info('Deleting user (mock)', { id: String(id) })
      const numId = Number(id)
      if (!mockUsersMap.has(numId)) {
        const message = 'User not found'
        return { success: false, message, errors: [message] }
      }
      mockUsersMap = new Map(
        Array.from(mockUsersMap.entries()).filter(([key]) => key !== numId)
      )
      logger.info('User deleted', { id: String(id) })
      return { success: true, message: 'User deleted successfully' }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete user'
      logger.error(
        'deleteUser failed',
        error instanceof Error ? error : new Error(message),
        { id: String(id) }
      )
      return { success: false, message, errors: [message] }
    }
  },
}
