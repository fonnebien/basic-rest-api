import { describe, expect, it } from "@jest/globals";
import type { Author } from "@models/author.model.js";
import { AuthorService } from "@services/author.service.js";
import { FakeAuthorRepository } from "../testing/fake-author.repository.js";
import { silentLogger } from "../testing/silent.logger.js";

const moore: Author = {
  id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  name: "Alan Moore",
  bio: "English writer",
  birthDate: "1953-11-18T00:00:00.000Z",
};

const clear: Author = {
  id: "7c0e7693-2587-4d44-9a2b-c383f6f3a887",
  name: "James Clear",
};

const createService = (authors: Author[] = [moore, clear]) =>
  new AuthorService(new FakeAuthorRepository(authors), silentLogger);

describe("AuthorService", () => {
  describe("getAllAuthors", () => {
    it("returns all authors", async () => {
      expect(await createService().getAllAuthors()).toEqual([moore, clear]);
    });

    it("returns an empty list when there are no authors", async () => {
      expect(await createService([]).getAllAuthors()).toEqual([]);
    });
  });

  describe("getAuthorById", () => {
    it("returns the matching author", async () => {
      expect(await createService().getAuthorById(moore.id)).toEqual(moore);
    });

    it("returns null for an unknown id", async () => {
      expect(await createService().getAuthorById("unknown")).toBeNull();
    });
  });

  describe("createAuthor", () => {
    it("assigns a generated id and persists the author", async () => {
      const service = createService([]);

      const created = await service.createAuthor({ name: "Cal Newport" });

      expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(created.name).toBe("Cal Newport");
      expect(await service.getAuthorById(created.id)).toEqual(created);
    });

    it("generates a distinct id for every author", async () => {
      const service = createService([]);

      const first = await service.createAuthor({ name: "A" });
      const second = await service.createAuthor({ name: "A" });

      expect(first.id).not.toBe(second.id);
    });
  });

  describe("updateAuthor", () => {
    it("merges the changes into the existing author", async () => {
      const service = createService();

      const updated = await service.updateAuthor(moore.id, {
        bio: "Updated bio",
      });

      expect(updated).toEqual({ ...moore, bio: "Updated bio" });
      expect(await service.getAuthorById(moore.id)).toEqual(updated);
    });

    it("returns null for an unknown id", async () => {
      expect(
        await createService().updateAuthor("unknown", { name: "Nope" }),
      ).toBeNull();
    });
  });

  describe("deleteAuthor", () => {
    it("removes the author and returns true", async () => {
      const service = createService();

      expect(await service.deleteAuthor(moore.id)).toBe(true);
      expect(await service.getAuthorById(moore.id)).toBeNull();
    });

    it("returns false for an unknown id", async () => {
      expect(await createService().deleteAuthor("unknown")).toBe(false);
    });
  });

  describe("searchAuthors", () => {
    it("matches names case-insensitively", async () => {
      expect(await createService().searchAuthors("ALAN")).toEqual([moore]);
    });

    it("matches on a partial name", async () => {
      expect(await createService().searchAuthors("clea")).toEqual([clear]);
    });

    it("returns an empty list when nothing matches", async () => {
      expect(await createService().searchAuthors("zzz")).toEqual([]);
    });
  });
});
