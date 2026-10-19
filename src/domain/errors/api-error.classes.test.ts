import { describe, expect, it } from "vitest";
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
} from "./api-error.classes.js";

describe("ApiError", () => {
  it("is an Error with code, status, message and details", () => {
    const error = new ApiError("SOME_CODE", "Something", 418, { a: 1 });

    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({
      code: "SOME_CODE",
      message: "Something",
      status: 418,
      details: { a: 1 },
    });
    expect(error.stack).toBeDefined();
  });

  it("uses the subclass name as error name", () => {
    expect(new ResourceNotFoundError("Book").name).toBe(
      "ResourceNotFoundError",
    );
  });
});

describe("error subclasses", () => {
  it.each([
    [
      "ValidationError",
      new ValidationError([{ field: "title", message: "Required" }]),
      400,
      "VALIDATION_ERROR",
    ],
    ["BadRequestError", new BadRequestError(), 400, "BAD_REQUEST"],
    [
      "AuthenticationError",
      new AuthenticationError("missing_token"),
      401,
      "AUTHENTICATION_ERROR",
    ],
    [
      "AuthorizationError",
      new AuthorizationError(),
      403,
      "AUTHORIZATION_ERROR",
    ],
    [
      "ResourceNotFoundError",
      new ResourceNotFoundError("Book", "42"),
      404,
      "RESOURCE_NOT_FOUND",
    ],
    ["ConflictError", new ConflictError(), 409, "CONFLICT"],
    [
      "RateLimitError",
      new RateLimitError(30, 100, 0),
      429,
      "RATE_LIMIT_EXCEEDED",
    ],
    ["ServerError", new ServerError(), 500, "INTERNAL_SERVER_ERROR"],
  ])("%s has the right status and code", (_name, error, status, code) => {
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(status);
    expect(error.code).toBe(code);
  });

  it("ResourceNotFoundError builds a message from resource and id", () => {
    const error = new ResourceNotFoundError("Author", "42");

    expect(error.message).toBe("Author with id '42' was not found.");
    expect(error).toMatchObject({ resource: "Author", identifier: "42" });
    expect(new ResourceNotFoundError("Author").message).toBe(
      "Author was not found.",
    );
  });

  it("carries type-specific fields", () => {
    expect(
      new ValidationError([{ field: "title", message: "Required" }])
        .invalidFields,
    ).toEqual([{ field: "title", message: "Required" }]);
    expect(new AuthenticationError("expired_token").authFailure).toBe(
      "expired_token",
    );
    expect(
      new AuthorizationError("No", {
        permission: "books:write",
        role: "admin",
      }),
    ).toMatchObject({
      requiredPermission: "books:write",
      requiredRole: "admin",
    });
    expect(
      new ConflictError("Dup", { resource: "Book", reason: "same title" }),
    ).toMatchObject({
      conflictingResource: "Book",
      conflictReason: "same title",
    });
    expect(new RateLimitError(30, 100, 0)).toMatchObject({
      retryAfter: 30,
      limit: 100,
      remaining: 0,
    });
    expect(new BadRequestError("Bad", ["q"]).invalidParameters).toEqual(["q"]);
  });

  it("ServerError is non-operational by default", () => {
    expect(new ServerError().isOperational).toBe(false);
    expect(new ServerError("x", { isOperational: true }).isOperational).toBe(
      true,
    );
  });
});
