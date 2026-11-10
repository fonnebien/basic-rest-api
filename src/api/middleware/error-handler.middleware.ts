import {
  ApiError,
  AuthenticationError,
  AuthorizationError,
  BadRequestError,
  ConflictError,
  RateLimitError,
  ResourceNotFoundError,
  ServerError,
  ValidationError,
} from "#api/errors/api-error.classes.js";
import type { LoggerPort } from "#domain/ports/logger.port.js";
import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface ErrorHandlerOptions {
  logger: LoggerPort;
  isProduction: boolean;
}

export const createErrorHandler =
  ({ logger, isProduction }: ErrorHandlerOptions): ErrorHandler =>
  (err, c) => {
    logger.error("Error caught by error handler:", err);

    if (err instanceof HTTPException) {
      return c.json(
        { error: { code: "BAD_REQUEST", message: err.message } },
        err.status as ContentfulStatusCode,
      );
    }

    if (err instanceof ApiError) {
      return c.json(
        formatApiError(err, isProduction),
        err.status as ContentfulStatusCode,
      );
    }

    // Handle unknown errors
    const serverError = new ServerError(undefined, {
      trace: isProduction ? undefined : err.stack,
    });

    return c.json(formatApiError(serverError, isProduction), 500);
  };

function formatApiError(
  error: ApiError,
  isProduction: boolean,
): Record<string, unknown> {
  const baseError = {
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
    },
  };

  // Add specific fields for different error types
  if (error instanceof ValidationError) {
    return { ...baseError, invalidFields: error.invalidFields };
  }

  if (error instanceof AuthenticationError) {
    return { ...baseError, authFailure: error.authFailure };
  }

  if (error instanceof AuthorizationError) {
    return {
      ...baseError,
      requiredPermission: error.requiredPermission,
      requiredRole: error.requiredRole,
    };
  }

  if (error instanceof ResourceNotFoundError) {
    return {
      ...baseError,
      resource: error.resource,
      identifier: error.identifier,
    };
  }

  if (error instanceof RateLimitError) {
    return {
      ...baseError,
      retryAfter: error.retryAfter,
      limit: error.limit,
      remaining: error.remaining,
    };
  }

  if (error instanceof ServerError) {
    return {
      error: {
        ...baseError.error,
        ...(!isProduction && error.trace ? { trace: error.trace } : {}),
      },
    };
  }

  if (error instanceof ConflictError) {
    return {
      ...baseError,
      conflictingResource: error.conflictingResource,
      conflictReason: error.conflictReason,
    };
  }

  if (error instanceof BadRequestError) {
    return { ...baseError, invalidParameters: error.invalidParameters };
  }

  return baseError;
}
