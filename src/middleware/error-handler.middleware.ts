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
} from "@domain/errors/api-error.classes.js";
import { Logger } from "@infrastructure/logger/pino.logger.js";
import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const logger = Logger.getInstance("api:middleware:error-handler");

export const errorHandler: ErrorHandler = (err, c) => {
  logger.error("Error caught by error handler:", err);

  if (err instanceof HTTPException) {
    return c.json(
      { error: { code: "BAD_REQUEST", message: err.message } },
      err.status as ContentfulStatusCode,
    );
  }

  if (err instanceof ApiError) {
    return c.json(formatApiError(err), err.status as ContentfulStatusCode);
  }

  // Handle unknown errors
  const serverError = new ServerError(undefined, {
    trace: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });

  return c.json(formatApiError(serverError), 500);
};

function formatApiError(error: ApiError): Record<string, unknown> {
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
        ...(process.env.NODE_ENV !== "production" && error.trace
          ? { trace: error.trace }
          : {}),
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
