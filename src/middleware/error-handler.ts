import { type Context, type MiddlewareHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import {
  type APIError,
  type AuthenticationError,
  type AuthorizationError,
  type BadRequestError,
  type ConflictError,
  type RateLimitError,
  type ResourceNotFoundError,
  type ServerError,
  type ValidationError,
} from "../types/error.ts";
import { Logger } from "../util/logger.util.ts";

const logger = Logger.getInstance("api:middleware:error-handler");

/**
 * Error handler middleware for Hono
 * Catches errors thrown in the request pipeline and formats appropriate responses
 */
export const errorHandler = (): MiddlewareHandler => {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (err) {
      logger.error("Error caught by error handler:", err as Error);

      // Handle known error types
      if (isAPIError(err)) {
        return c.json(formatAPIError(err), err.status as ContentfulStatusCode);
      }

      // Handle unknown errors
      const serverError: ServerError = {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
        status: 500,
        isOperational: false,
        trace:
          process.env.NODE_ENV === "production"
            ? undefined
            : (err as unknown) instanceof Error
              ? (err as Error).stack
              : String(err),
      };

      return c.json(formatAPIError(serverError), 500);
    }
  };
};

/**
 * Type guard to check if an error is an APIError
 */
function isAPIError(err: unknown): err is APIError {
  return typeof err === "object" && err !== null && "code" in err && "message" in err && "status" in err;
}

/**
 * Format the API error for the response
 */
function formatAPIError(error: APIError): Record<string, unknown> {
  const baseError = {
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
    },
  };

  // Add specific fields for different error types
  if (isValidationError(error)) {
    return {
      ...baseError,
      invalidFields: error.invalidFields,
    };
  }

  if (isAuthenticationError(error)) {
    return {
      ...baseError,
      authFailure: error.authFailure,
    };
  }

  if (isAuthorizationError(error)) {
    return {
      ...baseError,
      requiredPermission: error.requiredPermission,
      requiredRole: error.requiredRole,
    };
  }

  if (isResourceNotFoundError(error)) {
    return {
      ...baseError,
      resource: error.resource,
      identifier: error.identifier,
    };
  }

  if (isRateLimitError(error)) {
    return {
      ...baseError,
      retryAfter: error.retryAfter,
      limit: error.limit,
      remaining: error.remaining,
    };
  }

  if (isServerError(error)) {
    const response = { ...baseError };
    if (process.env.NODE_ENV !== "production" && error.trace) {
      (response.error as ServerError).trace = error.trace;
    }
    return response;
  }

  if (isConflictError(error)) {
    return {
      ...baseError,
      conflictingResource: error.conflictingResource,
      conflictReason: error.conflictReason,
    };
  }

  if (isBadRequestError(error)) {
    return {
      ...baseError,
      invalidParameters: error.invalidParameters,
    };
  }

  return baseError;
}

// Type guards for specific error types
function isValidationError(error: APIError): error is ValidationError {
  return "invalidFields" in error;
}

function isAuthenticationError(error: APIError): error is AuthenticationError {
  return "authFailure" in error;
}

function isAuthorizationError(error: APIError): error is AuthorizationError {
  return "requiredPermission" in error || "requiredRole" in error;
}

function isResourceNotFoundError(error: APIError): error is ResourceNotFoundError {
  return "resource" in error;
}

function isRateLimitError(error: APIError): error is RateLimitError {
  return "retryAfter" in error;
}

function isServerError(error: APIError): error is ServerError {
  return "isOperational" in error;
}

function isConflictError(error: APIError): error is ConflictError {
  return "conflictingResource" in error || "conflictReason" in error;
}

function isBadRequestError(error: APIError): error is BadRequestError {
  return "invalidParameters" in error;
}
