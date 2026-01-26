import { z } from 'zod';

const authorSchema = z.object({
  name: z.string().min(1, { error: 'Name is required' }),
  bio: z.string().optional(),
  birthDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) {
        return true;
      }
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }),
});

const authorWithIdSchema = authorSchema.extend({
  id: z.uuid({ error: 'Invalid UUID format' }),
});

type Author = z.infer<typeof authorWithIdSchema>;
type AuthorCreation = z.infer<typeof authorSchema>;
type AuthorUpdate = Partial<AuthorCreation>;
type AuthorResponse = z.infer<typeof authorWithIdSchema>;

export { authorSchema, authorWithIdSchema, type Author, type AuthorCreation, type AuthorResponse, type AuthorUpdate };
