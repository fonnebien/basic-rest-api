import { describe, expect, it } from "@jest/globals";
import type { Book } from "@models/book.model.js";
import { BookService } from "@services/book.service.js";
import { FakeBookRepository } from "../testing/fake-book.repository.js";
import { silentLogger } from "../testing/silent.logger.js";

const authorId = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";

const watchmen: Book = {
  id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  title: "Watchmen",
  authorId,
  publicationYear: 1986,
  genre: "Graphic Novel",
};

const vForVendetta: Book = {
  id: "b4c0897a-2bdc-4fbd-8f6e-1d6a3f0c9a11",
  title: "V for Vendetta",
  authorId,
  publicationYear: 1988,
};

const createService = (books: Book[] = [watchmen, vForVendetta]) =>
  new BookService(new FakeBookRepository(books), silentLogger);

describe("BookService", () => {
  describe("getAllBooks", () => {
    it("returns all books", async () => {
      const books = await createService().getAllBooks();

      expect(books).toEqual([watchmen, vForVendetta]);
    });

    it("returns an empty list when there are no books", async () => {
      expect(await createService([]).getAllBooks()).toEqual([]);
    });
  });

  describe("getBookById", () => {
    it("returns the matching book", async () => {
      expect(await createService().getBookById(watchmen.id)).toEqual(watchmen);
    });

    it("returns null for an unknown id", async () => {
      expect(await createService().getBookById("unknown")).toBeNull();
    });
  });

  describe("createBook", () => {
    it("assigns a generated id and persists the book", async () => {
      const service = createService([]);

      const created = await service.createBook({
        title: "Dune",
        authorId,
        publicationYear: 1965,
      });

      expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(created).toMatchObject({ title: "Dune", publicationYear: 1965 });
      expect(await service.getBookById(created.id)).toEqual(created);
    });

    it("generates a distinct id for every book", async () => {
      const service = createService([]);
      const input = { title: "Dune", authorId, publicationYear: 1965 };

      const first = await service.createBook(input);
      const second = await service.createBook(input);

      expect(first.id).not.toBe(second.id);
    });
  });

  describe("updateBook", () => {
    it("merges the changes into the existing book", async () => {
      const service = createService();

      const updated = await service.updateBook(watchmen.id, {
        title: "Watchmen (Deluxe)",
      });

      expect(updated).toEqual({ ...watchmen, title: "Watchmen (Deluxe)" });
      expect(await service.getBookById(watchmen.id)).toEqual(updated);
    });

    it("returns null for an unknown id", async () => {
      expect(
        await createService().updateBook("unknown", { title: "Nope" }),
      ).toBeNull();
    });
  });

  describe("deleteBook", () => {
    it("removes the book and returns true", async () => {
      const service = createService();

      expect(await service.deleteBook(watchmen.id)).toBe(true);
      expect(await service.getBookById(watchmen.id)).toBeNull();
    });

    it("returns false for an unknown id", async () => {
      expect(await createService().deleteBook("unknown")).toBe(false);
    });
  });

  describe("searchBooks", () => {
    it("matches titles case-insensitively", async () => {
      expect(await createService().searchBooks("WATCH")).toEqual([watchmen]);
    });

    it("matches on a partial title", async () => {
      expect(await createService().searchBooks("vend")).toEqual([vForVendetta]);
    });

    it("returns an empty list when nothing matches", async () => {
      expect(await createService().searchBooks("zzz")).toEqual([]);
    });
  });
});
