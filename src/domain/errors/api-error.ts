import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface APIError {
  code: string;
  message: string;
  status: ContentfulStatusCode;
  details?: Record<string, unknown>;
}

export interface ValidationError extends APIError {
  invalidFields: Array<{
    field: string;
    message: string;
    value?: unknown;
  }>;
}

export interface AuthenticationError extends APIError {
  authFailure: "invalid_credentials" | "expired_token" | "invalid_token" | "missing_token";
}

export interface AuthorizationError extends APIError {
  requiredPermission?: string | string[];
  requiredRole?: string | string[];
}

export interface ResourceNotFoundError extends APIError {
  resource: string;
  identifier?: string | number;
}

export interface RateLimitError extends APIError {
  retryAfter: number; // Seconds until retry is allowed
  limit: number;
  remaining: number;
}

export interface ServerError extends APIError {
  trace?: string;
  isOperational?: boolean;
}

export interface ConflictError extends APIError {
  conflictingResource?: string;
  conflictReason?: string;
}

export interface BadRequestError extends APIError {
  invalidParameters?: string[];
}
