// User API types - DTOs for user endpoints
import type { User } from "../entities";
import type { QueryParams } from "./common";

// Request DTOs
export interface CreateUserRequest {
  name: string;
  email: string;
  role?: string;
}

export interface UpdateUserProfileRequest {
  name?: string;
  email?: string;
  role?: string;
}

export interface UsersQueryParams extends QueryParams {
  role?: string;
  status?: "active" | "inactive";
}

// Response DTOs
export interface UserResponse {
  user: User;
}

export interface UsersResponse {
  users: User[];
  total: number;
}
