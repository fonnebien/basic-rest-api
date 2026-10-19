import {
  BadRequestError,
  ResourceNotFoundError,
} from "@domain/errors/api-error.classes.js";
import { authorSchema } from "@api/v1/schemas/author.schema.js";
import type { AuthorService } from "@services/author.service.js";
import { idValidationSchema } from "@api/v1/schemas/id.schema.js";
import { validate } from "@middleware/validate.middleware.js";
import { Hono } from "hono";
import type { RequestIdVariables } from "hono/request-id";

export const createAuthorRouter = (authorService: AuthorService) => {
  const router = new Hono<{ Variables: RequestIdVariables }>();

  router.get("/", async (c) => {
    const authors = await authorService.getAllAuthors();

    return c.json(authors);
  });

  // Must be registered before "/:id", otherwise "search" is matched as an id.
  router.get("/search", async (c) => {
    const query = c.req.query("query");

    if (!query) {
      throw new BadRequestError("Query parameter is required", ["query"]);
    }

    const authors = await authorService.searchAuthors(query);

    return c.json(authors);
  });

  router.get("/:id", validate("param", idValidationSchema), async (c) => {
    const { id } = c.req.valid("param");

    const author = await authorService.getAuthorById(id);

    if (!author) {
      throw new ResourceNotFoundError("Author", id);
    }

    return c.json(author);
  });

  router.post("/", validate("json", authorSchema), async (c) => {
    const newAuthor = await authorService.createAuthor(c.req.valid("json"));

    return c.json(newAuthor, 201);
  });

  router.put(
    "/:id",
    validate("param", idValidationSchema),
    validate("json", authorSchema),
    async (c) => {
      const { id } = c.req.valid("param");

      const author = await authorService.updateAuthor(id, c.req.valid("json"));

      if (!author) {
        throw new ResourceNotFoundError("Author", id);
      }

      return c.json(author);
    },
  );

  router.delete("/:id", validate("param", idValidationSchema), async (c) => {
    const { id } = c.req.valid("param");

    const result = await authorService.deleteAuthor(id);

    return c.json({ success: result });
  });

  return router;
};
