import { describe, expect, it } from "@jest/globals";
import type { Author } from "@models/author.model.js";
import {
  createTestApp,
  jsonRequest,
} from "../../../testing/create-test-app.js";

const moore: Author = {
  id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  name: "Alan Moore",
  bio: "English writer",
};

const clear: Author = {
  id: "7c0e7693-2587-4d44-9a2b-c383f6f3a887",
  name: "James Clear",
};

const unknownId = "00000000-0000-4000-8000-000000000000";

const setup = () => createTestApp({ authors: [moore, clear] });

describe("authors endpoints", () => {
  describe("GET /api/v1/authors", () => {
    it("returns all authors", async () => {
      const res = await setup().app.request("/api/v1/authors");

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([moore, clear]);
    });
  });

  describe("GET /api/v1/authors/search", () => {
    it("returns matching authors and is not shadowed by /:id", async () => {
      const res = await setup().app.request(
        "/api/v1/authors/search?query=alan",
      );

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([moore]);
    });

    it("returns 400 without a query", async () => {
      const res = await setup().app.request("/api/v1/authors/search");

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v1/authors/:id", () => {
    it("returns the author", async () => {
      const res = await setup().app.request(`/api/v1/authors/${moore.id}`);

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(moore);
    });

    it("returns 404 for an unknown id", async () => {
      const res = await setup().app.request(`/api/v1/authors/${unknownId}`);

      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({ error: "Author not found" });
    });

    it("returns 400 for an invalid UUID", async () => {
      const res = await setup().app.request("/api/v1/authors/not-a-uuid");

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/v1/authors", () => {
    it("creates an author with a generated id", async () => {
      const { app } = setup();

      const res = await app.request(
        "/api/v1/authors",
        jsonRequest("POST", { name: "Cal Newport", birthDate: "1982-06-23" }),
      );
      const created = await res.json();

      expect(res.status).toBe(201);
      expect(created).toMatchObject({ name: "Cal Newport" });
      expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
      expect((await app.request(`/api/v1/authors/${created.id}`)).status).toBe(
        200,
      );
    });

    it.each([
      ["an empty name", { name: "" }],
      ["a missing name", { bio: "no name" }],
      ["an unparseable birth date", { name: "X", birthDate: "not-a-date" }],
    ])("returns 400 for %s", async (_name, body) => {
      const res = await setup().app.request(
        "/api/v1/authors",
        jsonRequest("POST", body),
      );

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/v1/authors/:id", () => {
    it("updates the author", async () => {
      const res = await setup().app.request(
        `/api/v1/authors/${moore.id}`,
        jsonRequest("PUT", { name: "Alan Moore", bio: "Updated" }),
      );

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ...moore, bio: "Updated" });
    });

    it("returns 404 for an unknown id", async () => {
      const res = await setup().app.request(
        `/api/v1/authors/${unknownId}`,
        jsonRequest("PUT", { name: "Nobody" }),
      );

      expect(res.status).toBe(404);
    });

    it("returns 400 for an invalid body", async () => {
      const res = await setup().app.request(
        `/api/v1/authors/${moore.id}`,
        jsonRequest("PUT", { name: "" }),
      );

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/v1/authors/:id", () => {
    it("deletes the author", async () => {
      const { app } = setup();

      const res = await app.request(`/api/v1/authors/${moore.id}`, {
        method: "DELETE",
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ success: true });
      expect((await app.request(`/api/v1/authors/${moore.id}`)).status).toBe(
        404,
      );
    });

    it("reports success false for an unknown id", async () => {
      const res = await setup().app.request(`/api/v1/authors/${unknownId}`, {
        method: "DELETE",
      });

      expect(await res.json()).toEqual({ success: false });
    });
  });
});
