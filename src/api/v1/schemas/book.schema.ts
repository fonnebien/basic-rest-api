import { z } from "zod";

const bookSchema = z.object({
  title: z.string().min(1, { error: "Title is required" }),
  authorId: z.uuid({ error: "Invalid UUID format" }),
  publicationYear: z
    .number()
    .int()
    .min(1500, { error: "Publication year must be after 1500" })
    .max(new Date().getFullYear(), {
      error: "Publication year cannot be in the future",
    }),
  genre: z.string().optional(),
  summary: z.string().optional(),
});

export { bookSchema };
