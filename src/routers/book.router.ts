import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import type { RequestIdVariables } from 'hono/request-id';
import { bookSchema } from '../models/book.model.ts';
import { idValidationSchema } from '../schemas/validation.schema.ts';
import { BookService } from '../services/book.service.ts';

const bookRouter = new Hono<{ Variables: RequestIdVariables }>();
const bookService = new BookService();

bookRouter.get('/', async (c) => {
  const books = await bookService.getAllBooks();

  return c.json(books);
});

bookRouter.get('/:id', zValidator('param', idValidationSchema), async (c) => {
  const { id } = c.req.valid('param');

  if (!id) {
    return c.json({ error: 'ID parameter is required' }, 400);
  }

  const book = await bookService.getBookById(id);

  if (!book) {
    return c.json({ error: 'Book not found' }, 404);
  }

  return c.json(book);
});

bookRouter.post('/', async (c) => {
  const book = await c.req.json();

  if (!book) {
    return c.json({ error: 'Book data is required' }, 400);
  }

  const newBook = await bookService.createBook(book);

  return c.json(newBook);
});

bookRouter.put('/:id', zValidator('param', idValidationSchema), zValidator('json', bookSchema), async (c) => {
  const { id } = c.req.valid('param');
  const updatedBook = await c.req.valid('json');

  if (!id) {
    return c.json({ error: 'ID parameter is required' }, 400);
  }

  if (!updatedBook) {
    return c.json({ error: 'Updated book data is required' }, 400);
  }

  const book = await bookService.updateBook(id, updatedBook);

  if (!book) {
    return c.json({ error: 'Book not found' }, 404);
  }

  return c.json(book);
});

bookRouter.delete('/:id', zValidator('param', idValidationSchema), async (c) => {
  const { id } = c.req.valid('param');

  if (!id) {
    return c.json({ error: 'ID parameter is required' }, 400);
  }

  const bookDeleted = await bookService.deleteBook(id);

  return c.json({ success: bookDeleted });
});

bookRouter.get('/search', async (c) => {
  const query = c.req.query('query');

  if (!query) {
    return c.json({ error: 'Query parameter is required' }, 400);
  }

  const searchResults = await bookService.searchBooks(query);

  return c.json(searchResults);
});

export default bookRouter;
