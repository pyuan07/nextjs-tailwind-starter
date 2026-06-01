import { describe, it, expect, beforeEach } from 'vitest'
import { userService } from '@/services'
import { resetMockUsers } from '@/services/user.service'

describe('userService', () => {
  beforeEach(() => {
    resetMockUsers()
  })

  describe('getUsers', () => {
    it('returns success with an array of users', async () => {
      const result = await userService.getUsers()
      expect(result.success).toBe(true)
      if (result.success) {
        expect(Array.isArray(result.data)).toBe(true)
        expect(result.data.length).toBeGreaterThan(0)
      }
    })
  })

  describe('getUserById', () => {
    it('returns success for an existing user', async () => {
      const result = await userService.getUserById(1)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe(1)
      }
    })

    it('returns not found for a missing id', async () => {
      const result = await userService.getUserById('nonexistent-id')
      expect(result.success).toBe(false)
    })
  })

  describe('createUser', () => {
    it('creates a user and returns it', async () => {
      const result = await userService.createUser({
        name: 'Test User',
        email: 'test@test.com',
        role: 'user',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@test.com')
        expect(result.data.name).toBe('Test User')
        expect(result.data.role).toBe('user')
        expect(result.data.lang).toBe('en')
      }
    })

    it('returns error for duplicate email', async () => {
      await userService.createUser({
        name: 'Dup',
        email: 'dup@test.com',
        role: 'user',
      })
      const result = await userService.createUser({
        name: 'Dup2',
        email: 'dup@test.com',
        role: 'user',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0)
      }
    })

    it('accepts optional lang and isEmailVerified fields', async () => {
      const result = await userService.createUser({
        name: 'L',
        email: 'l@test.com',
        role: 'admin',
        lang: 'zh',
        isEmailVerified: true,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.lang).toBe('zh')
        expect(result.data.isEmailVerified).toBe(true)
      }
    })
  })

  describe('updateUser', () => {
    it('updates a user and returns the updated record', async () => {
      const result = await userService.updateUser(1, { name: 'Updated Name' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Updated Name')
        expect(result.data.id).toBe(1)
      }
    })

    it('returns not found for a missing id', async () => {
      const result = await userService.updateUser(9999, { name: 'Ghost' })
      expect(result.success).toBe(false)
    })
  })

  describe('deleteUser', () => {
    it('deletes a user and prevents subsequent retrieval', async () => {
      const del = await userService.deleteUser(1)
      expect(del.success).toBe(true)
      const get = await userService.getUserById(1)
      expect(get.success).toBe(false)
    })

    it('returns not found for a missing id', async () => {
      const result = await userService.deleteUser(9999)
      expect(result.success).toBe(false)
    })
  })
})
