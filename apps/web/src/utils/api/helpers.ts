// Simplified API helpers - only essential utilities
import type { ApiError } from "@/types/api/common";

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String((error as ApiError).message);
  }

  return "An unexpected error occurred";
}

/**
 * Simple query string builder
 */
export function buildQueryString(params: Record<string, unknown> = {}): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

/**
 * Check if error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    error !== null &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  );
}
