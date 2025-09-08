/* eslint-disable no-console */
import { env } from "@/config/env";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: string;
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  timestamp: string;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = env.isDevelopment;
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = context ? JSON.stringify(context, null, 2) : "";

    return `[${timestamp}] [${levelName}] ${message}${contextStr ? `\nContext: ${contextStr}` : ""}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
  ): LogEntry {
    return {
      level,
      message,
      context: {
        ...context,
        userAgent:
          typeof window !== "undefined"
            ? window.navigator.userAgent
            : undefined,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        timestamp: new Date().toISOString(),
      },
      error,
      timestamp: new Date().toISOString(),
    };
  }

  private async sendToService(_logEntry: LogEntry): Promise<void> {
    // In production, send logs to external service (e.g., Sentry, LogRocket)
    if (!this.isDevelopment) {
      try {
        // Example: Send to external logging service
        // await fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(logEntry),
        // })
      } catch (error) {
        // Fallback to console if external service fails
        console.error("Failed to send log to service:", error);
      }
    }
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const logEntry = this.createLogEntry(LogLevel.DEBUG, message, context);
    console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    this.sendToService(logEntry);
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const logEntry = this.createLogEntry(LogLevel.INFO, message, context);
    console.info(this.formatMessage(LogLevel.INFO, message, context));
    this.sendToService(logEntry);
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const logEntry = this.createLogEntry(LogLevel.WARN, message, context);
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
    this.sendToService(logEntry);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const logEntry = this.createLogEntry(
      LogLevel.ERROR,
      message,
      context,
      error,
    );
    console.error(this.formatMessage(LogLevel.ERROR, message, context), error);
    this.sendToService(logEntry);
  }

  // API specific logging
  apiRequest(method: string, url: string, context?: LogContext): void {
    this.info(`API Request: ${method} ${url}`, {
      ...context,
      type: "api_request",
      method,
      url,
    });
  }

  apiResponse(
    method: string,
    url: string,
    status: number,
    duration: number,
    context?: LogContext,
  ): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `API Response: ${method} ${url} - ${status} (${duration}ms)`;

    if (level === LogLevel.ERROR) {
      this.error(message, undefined, {
        ...context,
        type: "api_response",
        method,
        url,
        status,
        duration,
      });
    } else {
      this.info(message, {
        ...context,
        type: "api_response",
        method,
        url,
        status,
        duration,
      });
    }
  }

  // User action logging
  userAction(action: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, {
      ...context,
      type: "user_action",
      action,
    });
  }

  // Performance logging
  performance(metric: string, value: number, context?: LogContext): void {
    this.info(`Performance: ${metric} = ${value}ms`, {
      ...context,
      type: "performance",
      metric,
      value,
    });
  }

  // Security logging
  securityEvent(event: string, context?: LogContext): void {
    this.warn(`Security Event: ${event}`, {
      ...context,
      type: "security",
      event,
    });
  }
}

// Create singleton instance
export const logger = new Logger();
export default logger;

// Performance measurement utility
export function measurePerformance<T>(
  operation: () => T | Promise<T>,
  operationName: string,
  context?: LogContext,
): T | Promise<T> {
  const start = performance.now();

  const finish = (result: T) => {
    const duration = performance.now() - start;
    logger.performance(operationName, duration, context);
    return result;
  };

  try {
    const result = operation();

    if (result instanceof Promise) {
      return result.then(finish).catch((error) => {
        const duration = performance.now() - start;
        logger.error(`Failed operation: ${operationName}`, error as Error, {
          ...context,
          duration,
        });
        throw error;
      });
    }

    return finish(result);
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`Failed operation: ${operationName}`, error as Error, {
      ...context,
      duration,
    });
    throw error;
  }
}
