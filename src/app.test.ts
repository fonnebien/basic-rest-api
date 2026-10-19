import { describe, expect, it, jest } from "@jest/globals";
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
      // Hono only passes Error instances to onError, so typed API errors
      // must be thrown as Errors that carry the API error fields.
      jest.spyOn(bookService, "getAllBooks").mockRejectedValue(
        Object.assign(new Error("Book was not found"), {
          code: "RESOURCE_NOT_FOUND",
          status: 404,
          resource: "book",
        }),
      );

      const res = await app.request("/api/v1/books");

      expect(res.status).toBe(404);
      expect(await res.json()).toMatchObject({
        error: { code: "RESOURCE_NOT_FOUND", message: "Book was not found" },
        resource: "book",
      });
    });

    it("hides the message of unexpected errors behind a 500", async () => {
      const { app, bookService } = createTestApp();
      jest
        .spyOn(bookService, "getAllBooks")
        .mockRejectedValue(new Error("database password is hunter2"));

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
      jest.spyOn(bookService, "getAllBooks").mockRejectedValue(new Error("x"));
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
