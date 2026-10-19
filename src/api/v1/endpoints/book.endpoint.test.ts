import { describe, expect, it } from "@jest/globals";
import type { Book } from "@models/book.model.js";
import {
  createTestApp,
  jsonRequest,
} from "../../../testing/create-test-app.js";

const authorId = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";

const watchmen: Book = {
  id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  title: "Watchmen",
  authorId,
  publicationYear: 1986,
};

const vForVendetta: Book = {
  id: "b4c0897a-2bdc-4fbd-8f6e-1d6a3f0c9a11",
  title: "V for Vendetta",
  authorId,
  publicationYear: 1988,
};

const unknownId = "00000000-0000-4000-8000-000000000000";

const validBody = { title: "Dune", authorId, publicationYear: 1965 };

const setup = () => createTestApp({ books: [watchmen, vForVendetta] });

describe("books endpoints", () => {
  describe("GET /api/v1/books", () => {
    it("returns all books", async () => {
      const res = await setup().app.request("/api/v1/books");

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([watchmen, vForVendetta]);
    });
  });

  describe("GET /api/v1/books/search", () => {
    it("returns matching books and is not shadowed by /:id", async () => {
      const res = await setup().app.request("/api/v1/books/search?query=watch");

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([watchmen]);
    });

    it("returns 400 without a query", async () => {
      const res = await setup().app.request("/api/v1/books/search");

      expect(res.status).toBe(400);
      expect(await res.json()).toMatchObject({
        error: { code: "BAD_REQUEST", message: "Query parameter is required" },
        invalidParameters: ["query"],
      });
    });
  });

  describe("GET /api/v1/books/:id", () => {
    it("returns the book", async () => {
      const res = await setup().app.request(`/api/v1/books/${watchmen.id}`);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(watchmen);
    });

    it("returns 404 for an unknown id", async () => {
      const res = await setup().app.request(`/api/v1/books/${unknownId}`);

      expect(res.status).toBe(404);
      expect(await res.json()).toMatchObject({
        error: { code: "RESOURCE_NOT_FOUND" },
        resource: "Book",
        identifier: unknownId,
      });
    });

    it("returns 400 for an invalid UUID", async () => {
      const res = await setup().app.request("/api/v1/books/not-a-uuid");

      expect(res.status).toBe(400);
      expect(await res.json()).toMatchObject({
        error: { code: "VALIDATION_ERROR" },
        invalidFields: [{ field: "id", message: "Invalid UUID format for ID" }],
      });
    });
  });

  describe("POST /api/v1/books", () => {
    it("creates a book with a generated id", async () => {
      const { app } = setup();

      const res = await app.request(
        "/api/v1/books",
        jsonRequest("POST", validBody),
      );
      const created = await res.json();

      expect(res.status).toBe(201);
      expect(created).toMatchObject(validBody);
      expect(created.id).toMatch(/^[0-9a-f-]{36}$/);

      const fetched = await app.request(`/api/v1/books/${created.id}`);
      expect(fetched.status).toBe(200);
    });

    it("ignores a client-supplied id", async () => {
      const res = await setup().app.request(
        "/api/v1/books",
        jsonRequest("POST", { ...validBody, id: unknownId }),
      );

      expect((await res.json()).id).not.toBe(unknownId);
    });

    it.each([
      ["an empty title", { ...validBody, title: "" }],
      ["a missing author", { title: "Dune", publicationYear: 1965 }],
      ["an invalid author id", { ...validBody, authorId: "nope" }],
      ["a year before 1500", { ...validBody, publicationYear: 1499 }],
      [
        "a year in the future",
        { ...validBody, publicationYear: new Date().getFullYear() + 1 },
      ],
    ])("returns a validation error for %s", async (_name, body) => {
      const res = await setup().app.request(
        "/api/v1/books",
        jsonRequest("POST", body),
      );

      expect(res.status).toBe(400);
      expect((await res.json()).error.code).toBe("VALIDATION_ERROR");
    });

    it("lists the invalid fields", async () => {
      const res = await setup().app.request(
        "/api/v1/books",
        jsonRequest("POST", {
          title: "",
          authorId: "nope",
          publicationYear: 1965,
        }),
      );

      expect((await res.json()).invalidFields).toEqual([
        { field: "title", message: "Title is required" },
        { field: "authorId", message: "Invalid UUID format" },
      ]);
    });

    it("returns 400 for malformed JSON", async () => {
      const res = await setup().app.request("/api/v1/books", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{nope",
      });

      expect(res.status).toBe(400);
      expect((await res.json()).error.code).toBe("BAD_REQUEST");
    });
  });

  describe("PUT /api/v1/books/:id", () => {
    it("updates the book", async () => {
      const { app } = setup();

      const res = await app.request(
        `/api/v1/books/${watchmen.id}`,
        jsonRequest("PUT", { ...validBody, title: "Watchmen (Deluxe)" }),
      );

      expect(res.status).toBe(200);
      expect(await res.json()).toMatchObject({
        id: watchmen.id,
        title: "Watchmen (Deluxe)",
      });
    });

    it("returns 404 for an unknown id", async () => {
      const res = await setup().app.request(
        `/api/v1/books/${unknownId}`,
        jsonRequest("PUT", validBody),
      );

      expect(res.status).toBe(404);
    });

    it("returns 400 for an invalid body", async () => {
      const res = await setup().app.request(
        `/api/v1/books/${watchmen.id}`,
        jsonRequest("PUT", { ...validBody, title: "" }),
      );

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/v1/books/:id", () => {
    it("deletes the book", async () => {
      const { app } = setup();

      const res = await app.request(`/api/v1/books/${watchmen.id}`, {
        method: "DELETE",
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ success: true });
      expect((await app.request(`/api/v1/books/${watchmen.id}`)).status).toBe(
        404,
      );
    });

    it("reports success false for an unknown id", async () => {
      const res = await setup().app.request(`/api/v1/books/${unknownId}`, {
        method: "DELETE",
      });

      expect(await res.json()).toEqual({ success: false });
    });
  });
});
