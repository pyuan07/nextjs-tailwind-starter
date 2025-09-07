// User domain entity - represents the business model
export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role?: string
}

// User-related value objects
export interface UserProfile extends User {
  bio?: string
  location?: string
  website?: string
}

export type UserRole = 'admin' | 'user' | 'moderator'
