// Authentication API types - DTOs for auth endpoints
import type { User } from "../entities";

// Request DTOs
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

// Token types with industry standards
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: number; // Unix timestamp
  refreshTokenExpiry: number; // Unix timestamp
  tokenType: "Bearer";
}

// Response DTOs
export interface LoginResponse {
  user: User;
  tokens: TokenPair;
}

export interface RefreshTokenResponse {
  tokens: TokenPair;
}

export interface AuthResponse {
  user: User;
  tokens: TokenPair;
}

// Internal token storage structure
export interface StoredTokenInfo {
  accessToken: string;
  accessTokenExpiry: number;
  // Refresh token stored in httpOnly cookie, not here
}

// Token validation result
export interface TokenValidation {
  isValid: boolean;
  isExpired: boolean;
  expiresIn: number; // seconds until expiry
  needsRefresh: boolean; // true if expires in < 5 minutes
}
