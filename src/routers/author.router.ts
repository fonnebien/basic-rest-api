import { Hono } from 'hono';
import type { RequestIdVariables } from 'hono/request-id';
import { AuthorService } from '../services/author.service.ts';

const authorRouter = new Hono<{ Variables: RequestIdVariables }>();
const authorService = new AuthorService();

authorRouter.get('/', async (c) => {
  const authors = await authorService.getAllAuthors();
  return c.json(authors);
});

authorRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const author = await authorService.getAuthorById(id);
  return c.json(author);
});

authorRouter.post('/', async (c) => {
  const author = await c.req.json();
  const newAuthor = await authorService.createAuthor(author);
  return c.json(newAuthor);
});

authorRouter.put('/:id', async (c) => {
  const id = c.req.param('id');
  const updatedAuthor = await c.req.json();
  const author = await authorService.updateAuthor(id, updatedAuthor);
  return c.json(author);
});

authorRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const result = await authorService.deleteAuthor(id);
  return c.json({ success: result });
});

authorRouter.get('/search', async (c) => {
  const query = c.req.query('query');

  if (!query) {
    return c.json({ error: 'Query parameter is required' }, 400);
  }

  const authors = await authorService.searchAuthors(query);
  return c.json(authors);
});

export default authorRouter;
