import {
  BadRequestError,
  ResourceNotFoundError,
} from "@domain/errors/api-error.classes.js";
import { bookSchema } from "@api/v1/schemas/book.schema.js";
import type { BookService } from "@services/book.service.js";
import { idValidationSchema } from "@api/v1/schemas/id.schema.js";
import { validate } from "@middleware/validate.middleware.js";
import { Hono } from "hono";
import type { RequestIdVariables } from "hono/request-id";

export const createBookRouter = (bookService: BookService) => {
  const router = new Hono<{ Variables: RequestIdVariables }>();

  router.get("/", async (c) => {
    const books = await bookService.getAllBooks();

    return c.json(books);
  });

  // Must be registered before "/:id", otherwise "search" is matched as an id.
  router.get("/search", async (c) => {
    const query = c.req.query("query");

    if (!query) {
      throw new BadRequestError("Query parameter is required", ["query"]);
    }

    const searchResults = await bookService.searchBooks(query);

    return c.json(searchResults);
  });

  router.get("/:id", validate("param", idValidationSchema), async (c) => {
    const { id } = c.req.valid("param");

    const book = await bookService.getBookById(id);

    if (!book) {
      throw new ResourceNotFoundError("Book", id);
    }

    return c.json(book);
  });

  router.post("/", validate("json", bookSchema), async (c) => {
    const newBook = await bookService.createBook(c.req.valid("json"));

    return c.json(newBook, 201);
  });

  router.put(
    "/:id",
    validate("param", idValidationSchema),
    validate("json", bookSchema),
    async (c) => {
      const { id } = c.req.valid("param");

      const book = await bookService.updateBook(id, c.req.valid("json"));

      if (!book) {
        throw new ResourceNotFoundError("Book", id);
      }

      return c.json(book);
    },
  );

  router.delete("/:id", validate("param", idValidationSchema), async (c) => {
    const { id } = c.req.valid("param");

    const bookDeleted = await bookService.deleteBook(id);

    return c.json({ success: bookDeleted });
  });

  return router;
};
