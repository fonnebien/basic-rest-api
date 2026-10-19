import type { Author } from "@models/author.model.js";
import type { Book } from "@models/book.model.js";
import { AuthorService } from "@services/author.service.js";
import { BookService } from "@services/book.service.js";
import { createApp } from "../app.js";
import { FakeAuthorRepository } from "../domain/testing/fake-author.repository.js";
import { FakeBookRepository } from "../domain/testing/fake-book.repository.js";
import { silentLogger } from "../domain/testing/silent.logger.js";

export const createTestApp = (
  seed: { books?: Book[]; authors?: Author[] } = {},
) => {
  const bookService = new BookService(
    new FakeBookRepository(seed.books ?? []),
    silentLogger,
  );
  const authorService = new AuthorService(
    new FakeAuthorRepository(seed.authors ?? []),
    silentLogger,
  );

  return {
    app: createApp({ authorService, bookService }),
    bookService,
    authorService,
  };
};

export const jsonRequest = (method: string, body: unknown) => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});
