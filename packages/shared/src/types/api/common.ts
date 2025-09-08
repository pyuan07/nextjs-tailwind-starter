// Common API types - shared across all endpoints

// Standard API response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

// API error structure
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common query parameters
export interface QueryParams extends PaginationParams {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
