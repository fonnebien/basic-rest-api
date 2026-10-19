import type * as Shape from "./api-error.types.js";

export class ApiError extends Error implements Shape.APIError {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    status: number,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class ValidationError extends ApiError implements Shape.ValidationError {
  constructor(
    readonly invalidFields: Shape.ValidationError["invalidFields"],
    message = "Validation failed",
    details?: Record<string, unknown>,
  ) {
    super("VALIDATION_ERROR", message, 400, details);
  }
}

export class BadRequestError extends ApiError implements Shape.BadRequestError {
  readonly invalidParameters?: string[];

  constructor(
    message = "Bad request",
    invalidParameters?: string[],
    details?: Record<string, unknown>,
  ) {
    super("BAD_REQUEST", message, 400, details);
    this.invalidParameters = invalidParameters;
  }
}

export class AuthenticationError
  extends ApiError
  implements Shape.AuthenticationError
{
  constructor(
    readonly authFailure: Shape.AuthenticationError["authFailure"],
    message = "Authentication failed",
    details?: Record<string, unknown>,
  ) {
    super("AUTHENTICATION_ERROR", message, 401, details);
  }
}

export class AuthorizationError
  extends ApiError
  implements Shape.AuthorizationError
{
  readonly requiredPermission?: string | string[];
  readonly requiredRole?: string | string[];

  constructor(
    message = "Forbidden",
    required: { permission?: string | string[]; role?: string | string[] } = {},
    details?: Record<string, unknown>,
  ) {
    super("AUTHORIZATION_ERROR", message, 403, details);
    this.requiredPermission = required.permission;
    this.requiredRole = required.role;
  }
}

export class ResourceNotFoundError
  extends ApiError
  implements Shape.ResourceNotFoundError
{
  constructor(
    readonly resource: string,
    readonly identifier?: string | number,
    details?: Record<string, unknown>,
  ) {
    super(
      "RESOURCE_NOT_FOUND",
      identifier === undefined
        ? `${resource} was not found.`
        : `${resource} with id '${identifier}' was not found.`,
      404,
      details,
    );
  }
}

export class ConflictError extends ApiError implements Shape.ConflictError {
  readonly conflictingResource?: string;
  readonly conflictReason?: string;

  constructor(
    message = "Conflict",
    conflict: { resource?: string; reason?: string } = {},
    details?: Record<string, unknown>,
  ) {
    super("CONFLICT", message, 409, details);
    this.conflictingResource = conflict.resource;
    this.conflictReason = conflict.reason;
  }
}

export class RateLimitError extends ApiError implements Shape.RateLimitError {
  constructor(
    readonly retryAfter: number,
    readonly limit: number,
    readonly remaining: number,
    message = "Too many requests",
    details?: Record<string, unknown>,
  ) {
    super("RATE_LIMIT_EXCEEDED", message, 429, details);
  }
}

export class ServerError extends ApiError implements Shape.ServerError {
  readonly trace?: string;
  readonly isOperational: boolean;

  constructor(
    message = "An unexpected error occurred",
    options: {
      trace?: string;
      isOperational?: boolean;
      details?: Record<string, unknown>;
    } = {},
  ) {
    super("INTERNAL_SERVER_ERROR", message, 500, options.details);
    this.trace = options.trace;
    this.isOperational = options.isOperational ?? false;
  }
}
