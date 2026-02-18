import { AuthorService } from "@services/author.service.js";
import { Hono } from "hono";
import type { RequestIdVariables } from "hono/request-id";

const router = new Hono<{ Variables: RequestIdVariables }>();
const authorService = new AuthorService();

router.get("/", async (c) => {
  const authors = await authorService.getAllAuthors();
  return c.json(authors);
});

router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const author = await authorService.getAuthorById(id);
  return c.json(author);
});

router.post("/", async (c) => {
  const author = await c.req.json();
  const newAuthor = await authorService.createAuthor(author);
  return c.json(newAuthor);
});

router.put("/:id", async (c) => {
  const id = c.req.param("id");
  const updatedAuthor = await c.req.json();
  const author = await authorService.updateAuthor(id, updatedAuthor);
  return c.json(author);
});

router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await authorService.deleteAuthor(id);
  return c.json({ success: result });
});

router.get("/search", async (c) => {
  const query = c.req.query("query");

  if (!query) {
    return c.json({ error: "Query parameter is required" }, 400);
  }

  const authors = await authorService.searchAuthors(query);
  return c.json(authors);
});

export default router;
