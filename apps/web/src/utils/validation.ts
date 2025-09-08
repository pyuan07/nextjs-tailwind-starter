import { logger } from "@/lib/logger";

// Validation rule types
export type ValidationRule<T = unknown> = {
  message: string;
  validate: (
    value: T,
    allValues?: Record<string, unknown>,
  ) => boolean | Promise<boolean>;
};

export type ValidationRules<T = Record<string, unknown>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export type ValidationErrors<T = Record<string, unknown>> = {
  [K in keyof T]?: string[];
};

export type ValidationResult<T = Record<string, unknown>> = {
  isValid: boolean;
  errors: ValidationErrors<T>;
  hasErrors: boolean;
};

/**
 * Core validation engine
 */
export class Validator<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  private rules: ValidationRules<T> = {};
  private customMessages: Partial<Record<keyof T, string>> = {};

  constructor(rules?: ValidationRules<T>) {
    if (rules) {
      this.rules = rules;
    }
  }

  /**
   * Add validation rules for a field
   */
  field<K extends keyof T>(field: K, rules: ValidationRule<T[K]>[]) {
    this.rules[field] = rules;
    return this;
  }

  /**
   * Add a custom error message for a field
   */
  message<K extends keyof T>(field: K, message: string) {
    this.customMessages[field] = message;
    return this;
  }

  /**
   * Validate all fields
   */
  async validate(values: Partial<T>): Promise<ValidationResult<T>> {
    const errors: ValidationErrors<T> = {};
    let hasErrors = false;

    const startTime = Date.now();

    try {
      // Run validation for each field
      await Promise.all(
        Object.entries(this.rules).map(async ([fieldName, fieldRules]) => {
          const field = fieldName as keyof T;
          const value = values[field];
          const fieldErrors: string[] = [];

          if (fieldRules) {
            for (const rule of fieldRules) {
              try {
                const isValid = await rule.validate(value, values);
                if (!isValid) {
                  fieldErrors.push(this.customMessages[field] || rule.message);
                }
              } catch (error) {
                logger.error("Validation rule error", error as Error, {
                  field,
                  rule,
                });
                fieldErrors.push("Validation error occurred");
              }
            }
          }

          if (fieldErrors.length > 0) {
            errors[field] = fieldErrors;
            hasErrors = true;
          }
        }),
      );

      const duration = Date.now() - startTime;
      logger.info("Validation completed", {
        duration,
        hasErrors,
        fieldCount: Object.keys(values).length,
      });

      return {
        isValid: !hasErrors,
        errors,
        hasErrors,
      };
    } catch (error) {
      logger.error("Validation failed", error as Error);
      throw error;
    }
  }

  /**
   * Validate a single field
   */
  async validateField<K extends keyof T>(
    field: K,
    value: T[K],
    allValues?: Partial<T>,
  ): Promise<string[]> {
    const rules = this.rules[field];
    if (!rules) return [];

    const errors: string[] = [];

    for (const rule of rules) {
      try {
        const isValid = await rule.validate(value, allValues);
        if (!isValid) {
          errors.push(this.customMessages[field] || rule.message);
        }
      } catch (error) {
        logger.error("Field validation error", error as Error, { field });
        errors.push("Validation error occurred");
      }
    }

    return errors;
  }
}

/**
 * Pre-built validation rules
 */
export const rules = {
  // Required field
  required: <T>(message = "This field is required"): ValidationRule<T> => ({
    message,
    validate: (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string") return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    },
  }),

  // Minimum length
  minLength: (min: number, message?: string): ValidationRule<string> => ({
    message: message || `Must be at least ${min} characters`,
    validate: (value) => !value || value.length >= min,
  }),

  // Maximum length
  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    message: message || `Must be at most ${max} characters`,
    validate: (value) => !value || value.length <= max,
  }),

  // Email validation
  email: (
    message = "Please enter a valid email address",
  ): ValidationRule<string> => ({
    message,
    validate: (value) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
  }),

  // Password strength
  password: (
    options: {
      minLength?: number;
      requireUppercase?: boolean;
      requireLowercase?: boolean;
      requireNumbers?: boolean;
      requireSymbols?: boolean;
      message?: string;
    } = {},
  ): ValidationRule<string> => {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSymbols = false,
      message = "Password does not meet requirements",
    } = options;

    return {
      message,
      validate: (value) => {
        if (!value) return true;

        if (value.length < minLength) return false;
        if (requireUppercase && !/[A-Z]/.test(value)) return false;
        if (requireLowercase && !/[a-z]/.test(value)) return false;
        if (requireNumbers && !/\d/.test(value)) return false;
        if (requireSymbols && !/[^A-Za-z0-9]/.test(value)) return false;

        return true;
      },
    };
  },

  // Confirm password
  confirmPassword: (
    passwordField: string,
    message = "Passwords do not match",
  ): ValidationRule<string> => ({
    message,
    validate: (value, allValues) => {
      if (!value || !allValues) return true;
      return value === allValues[passwordField];
    },
  }),

  // URL validation
  url: (message = "Please enter a valid URL"): ValidationRule<string> => ({
    message,
    validate: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
  }),

  // Phone number (basic US format)
  phone: (
    message = "Please enter a valid phone number",
  ): ValidationRule<string> => ({
    message,
    validate: (value) => {
      if (!value) return true;
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      return phoneRegex.test(value.replace(/\s/g, ""));
    },
  }),

  // Number range
  numberRange: (
    min: number,
    max: number,
    message?: string,
  ): ValidationRule<number> => ({
    message: message || `Must be between ${min} and ${max}`,
    validate: (value) => {
      if (value === null || value === undefined) return true;
      return value >= min && value <= max;
    },
  }),

  // Custom regex
  pattern: (
    regex: RegExp,
    message = "Invalid format",
  ): ValidationRule<string> => ({
    message,
    validate: (value) => !value || regex.test(value),
  }),

  // Async validation (e.g., checking if username exists)
  async: <T>(
    asyncValidator: (value: T) => Promise<boolean>,
    message = "Validation failed",
  ): ValidationRule<T> => ({
    message,
    validate: async (value) => {
      try {
        return await asyncValidator(value);
      } catch (error) {
        logger.error("Async validation error", error as Error);
        return false;
      }
    },
  }),

  // File validation
  file: (
    options: {
      maxSize?: number; // in bytes
      allowedTypes?: string[];
      message?: string;
    } = {},
  ): ValidationRule<File | FileList> => {
    const {
      maxSize = 5 * 1024 * 1024,
      allowedTypes = [],
      message = "Invalid file",
    } = options;

    return {
      message,
      validate: (value) => {
        if (!value) return true;

        const files = value instanceof FileList ? Array.from(value) : [value];

        for (const file of files) {
          if (maxSize && file.size > maxSize) {
            return false;
          }
          if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
            return false;
          }
        }

        return true;
      },
    };
  },

  // Date validation
  date: (
    options: {
      minDate?: Date;
      maxDate?: Date;
      message?: string;
    } = {},
  ): ValidationRule<string | Date> => {
    const { minDate, maxDate, message = "Invalid date" } = options;

    return {
      message,
      validate: (value) => {
        if (!value) return true;

        const date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) return false;

        if (minDate && date < minDate) return false;
        if (maxDate && date > maxDate) return false;

        return true;
      },
    };
  },
};

/**
 * Helper function to create a validator with common form rules
 */
export function createFormValidator<T extends Record<string, unknown>>(config: {
  [K in keyof T]?: {
    rules: ValidationRule<T[K]>[];
    message?: string;
  };
}) {
  const validator = new Validator<T>();

  Object.entries(config).forEach(([field, { rules: fieldRules, message }]) => {
    validator.field(
      field as keyof T,
      fieldRules as ValidationRule<T[keyof T]>[],
    );
    if (message) {
      validator.message(field as keyof T, message);
    }
  });

  return validator;
}

/**
 * Utility to get the first error for each field
 */
export function getFirstErrors<T>(
  errors: ValidationErrors<T>,
): Record<keyof T, string | undefined> {
  const firstErrors: Record<string, string | undefined> = {};

  Object.entries(errors).forEach(([field, fieldErrors]) => {
    firstErrors[field] =
      Array.isArray(fieldErrors) && fieldErrors.length > 0
        ? fieldErrors[0]
        : undefined;
  });

  return firstErrors as Record<keyof T, string | undefined>;
}

/**
 * Check if a field has errors
 */
export function hasFieldError<T>(
  errors: ValidationErrors<T>,
  field: keyof T,
): boolean {
  const fieldErrors = errors[field];
  return Array.isArray(fieldErrors) && fieldErrors.length > 0;
}

/**
 * Get all errors as a flat array
 */
export function getAllErrors<T>(errors: ValidationErrors<T>): string[] {
  return Object.values(errors).flat().filter(Boolean) as string[];
}
