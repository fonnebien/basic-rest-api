import { describe, expect, it, vi } from "vitest";
import {
  AuthenticationError,
  AuthorizationError,
  BadRequestError,
  ConflictError,
  RateLimitError,
  ResourceNotFoundError,
  ValidationError,
} from "@domain/errors/api-error.classes.js";
import { createTestApp } from "./testing/create-test-app.js";

describe("app", () => {
  it("responds to the health check", async () => {
    const res = await createTestApp().app.request("/health");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("returns 404 for unknown routes", async () => {
    const res = await createTestApp().app.request("/nope");

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not Found" });
  });

  it("sets an x-request-id header", async () => {
    const res = await createTestApp().app.request("/health");

    expect(res.headers.get("x-request-id")).toBeTruthy();
  });

  describe("error handler", () => {
    it("maps typed API errors to their status and payload", async () => {
      const { app, bookService } = createTestApp();
      vi.spyOn(bookService, "getAllBooks").mockRejectedValue(
        new ResourceNotFoundError("Book", "42"),
      );

      const res = await app.request("/api/v1/books");

      expect(res.status).toBe(404);
      expect(await res.json()).toMatchObject({
        error: {
          code: "RESOURCE_NOT_FOUND",
          message: "Book with id '42' was not found.",
        },
        resource: "Book",
        identifier: "42",
      });
    });

    it.each([
      [
        new ValidationError([{ field: "title", message: "Required" }]),
        400,
        { invalidFields: [{ field: "title", message: "Required" }] },
      ],
      [
        new AuthenticationError("missing_token"),
        401,
        { authFailure: "missing_token" },
      ],
      [
        new AuthorizationError("No", { role: "admin" }),
        403,
        { requiredRole: "admin" },
      ],
      [
        new ConflictError("Dup", { reason: "same title" }),
        409,
        { conflictReason: "same title" },
      ],
      [
        new RateLimitError(30, 100, 0),
        429,
        { retryAfter: 30, limit: 100, remaining: 0 },
      ],
      [new BadRequestError("Bad", ["q"]), 400, { invalidParameters: ["q"] }],
    ])("includes type-specific fields for %p", async (error, status, extra) => {
      const { app, bookService } = createTestApp();
      vi.spyOn(bookService, "getAllBooks").mockRejectedValue(error);

      const res = await app.request("/api/v1/books");

      expect(res.status).toBe(status);
      expect(await res.json()).toMatchObject({
        error: { code: error.code, message: error.message },
        ...extra,
      });
    });

    it("hides the message of unexpected errors behind a 500", async () => {
      const { app, bookService } = createTestApp();
      vi.spyOn(bookService, "getAllBooks").mockRejectedValue(
        new Error("database password is hunter2"),
      );

      const res = await app.request("/api/v1/books");
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.error).toMatchObject({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      });
    });

    it("omits the stack trace in production", async () => {
      const { app, bookService } = createTestApp();
      vi.spyOn(bookService, "getAllBooks").mockRejectedValue(new Error("x"));
      const previous = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      try {
        const res = await app.request("/api/v1/books");

        expect((await res.json()).error.trace).toBeUndefined();
      } finally {
        process.env.NODE_ENV = previous;
      }
    });
  });
});
