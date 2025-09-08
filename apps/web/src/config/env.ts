// Validated environment configuration with proper error handling
import { logger } from "@/lib/logger";

// Environment variable validation schema
interface EnvSchema {
  // Required environment variables
  NODE_ENV: "development" | "production" | "test";

  // Optional environment variables with defaults
  NEXT_PUBLIC_API_BASE_URL?: string;
  NEXT_PUBLIC_APP_NAME?: string;
}

// Validate environment variables
function validateEnv(): EnvSchema {
  const nodeEnv = process.env.NODE_ENV;

  // Validate required NODE_ENV
  if (!nodeEnv || !["development", "production", "test"].includes(nodeEnv)) {
    const error = new Error(
      `Invalid NODE_ENV: "${nodeEnv}". Must be one of: development, production, test`,
    );
    console.error("Environment validation failed:", error);
    throw error;
  }

  // Log environment validation in development
  if (nodeEnv === "development") {
    logger.info("Environment variables validated successfully", {
      NODE_ENV: nodeEnv,
      API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "default",
      APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "default",
    });
  }

  return {
    NODE_ENV: nodeEnv as EnvSchema["NODE_ENV"],
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  };
}

// Validate environment on module load
const validatedEnv = validateEnv();

// Export validated and typed environment configuration
export const env = {
  // API Configuration
  API_BASE_URL:
    validatedEnv.NEXT_PUBLIC_API_BASE_URL ||
    "https://jsonplaceholder.typicode.com",

  // App Configuration
  APP_NAME: validatedEnv.NEXT_PUBLIC_APP_NAME || "React Tailwind Starter",

  // Auth Configuration
  AUTH_TOKEN_KEY: "auth_token",

  // Environment Info
  NODE_ENV: validatedEnv.NODE_ENV,
  isDevelopment: validatedEnv.NODE_ENV === "development",
  isProduction: validatedEnv.NODE_ENV === "production",
  isTest: validatedEnv.NODE_ENV === "test",
} as const;

export type Env = typeof env;

// Runtime environment check helper
export function checkEnvironmentRequirements(): boolean {
  try {
    // Check if running in browser
    if (typeof window !== "undefined") {
      // Browser environment checks
      if (!window.localStorage) {
        console.warn("localStorage is not available");
        return false;
      }

      if (!window.fetch) {
        console.error("fetch API is not available");
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Environment requirements check failed:", error);
    return false;
  }
}

// Development mode helpers
export const isDev = env.isDevelopment;
export const isProd = env.isProduction;
export const isTest = env.isTest;
