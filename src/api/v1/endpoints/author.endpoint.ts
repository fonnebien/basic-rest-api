import { zValidator } from "@hono/zod-validator";
import { authorSchema } from "@api/v1/schemas/author.schema.js";
import type { AuthorService } from "@services/author.service.js";
import { idValidationSchema } from "@api/v1/schemas/id.schema.js";
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
      return c.json({ error: "Query parameter is required" }, 400);
    }

    const authors = await authorService.searchAuthors(query);

    return c.json(authors);
  });

  router.get("/:id", zValidator("param", idValidationSchema), async (c) => {
    const { id } = c.req.valid("param");

    const author = await authorService.getAuthorById(id);

    if (!author) {
      return c.json({ error: "Author not found" }, 404);
    }

    return c.json(author);
  });

  router.post("/", zValidator("json", authorSchema), async (c) => {
    const newAuthor = await authorService.createAuthor(c.req.valid("json"));

    return c.json(newAuthor, 201);
  });

  router.put(
    "/:id",
    zValidator("param", idValidationSchema),
    zValidator("json", authorSchema),
    async (c) => {
      const { id } = c.req.valid("param");

      const author = await authorService.updateAuthor(id, c.req.valid("json"));

      if (!author) {
        return c.json({ error: "Author not found" }, 404);
      }

      return c.json(author);
    },
  );

  router.delete("/:id", zValidator("param", idValidationSchema), async (c) => {
    const { id } = c.req.valid("param");

    const result = await authorService.deleteAuthor(id);

    return c.json({ success: result });
  });

  return router;
};
