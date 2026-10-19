import { zValidator } from "@hono/zod-validator";
import { bookSchema } from "@models/book.model.js";
import type { BookService } from "@services/book.service.js";
import { idValidationSchema } from "@validations/id.schema.js";
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
      return c.json({ error: "Query parameter is required" }, 400);
    }

    const searchResults = await bookService.searchBooks(query);

    return c.json(searchResults);
  });

  router.get("/:id", zValidator("param", idValidationSchema), async (c) => {
    const { id } = c.req.valid("param");

    const book = await bookService.getBookById(id);

    if (!book) {
      return c.json({ error: "Book not found" }, 404);
    }

    return c.json(book);
  });

  router.post("/", zValidator("json", bookSchema), async (c) => {
    const newBook = await bookService.createBook(c.req.valid("json"));

    return c.json(newBook, 201);
  });

  router.put(
    "/:id",
    zValidator("param", idValidationSchema),
    zValidator("json", bookSchema),
    async (c) => {
      const { id } = c.req.valid("param");

      const book = await bookService.updateBook(id, c.req.valid("json"));

      if (!book) {
        return c.json({ error: "Book not found" }, 404);
      }

      return c.json(book);
    },
  );

  router.delete("/:id", zValidator("param", idValidationSchema), async (c) => {
    const { id } = c.req.valid("param");

    const bookDeleted = await bookService.deleteBook(id);

    return c.json({ success: bookDeleted });
  });

  return router;
};
