import { z } from 'zod';

const bookSchema = z.object({
  title: z.string().min(1, { error: 'Title is required' }),
  authorId: z.uuid({ error: 'Invalid UUID format' }),
  publicationYear: z
    .number()
    .int()
    .min(1500, { error: 'Publication year must be after 1500' })
    .max(new Date().getFullYear(), { error: 'Publication year cannot be in the future' }),
  genre: z.string().optional(),
  summary: z.string().optional(),
});

const bookWithIdSchema = bookSchema.extend({
  id: z.uuid({ error: 'Invalid UUID format' }),
});

type Book = z.infer<typeof bookWithIdSchema>;
type BookCreation = z.infer<typeof bookSchema>;
type BookUpdate = Partial<BookCreation>;
type BookResponse = z.infer<typeof bookWithIdSchema>;

export { bookSchema, bookWithIdSchema, type Book, type BookCreation, type BookResponse, type BookUpdate };
