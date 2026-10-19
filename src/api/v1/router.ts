import type { AuthorService } from "@services/author.service.js";
import type { BookService } from "@services/book.service.js";
import { Hono } from "hono";
import { createAuthorRouter } from "./endpoints/authors.js";
import { createBookRouter } from "./endpoints/books.js";

export interface ApiV1Services {
  authorService: AuthorService;
  bookService: BookService;
}

export const createApiV1Router = ({
  authorService,
  bookService,
}: ApiV1Services) => {
  const router = new Hono();

  router.route("/books", createBookRouter(bookService));
  router.route("/authors", createAuthorRouter(authorService));

  return router;
};
