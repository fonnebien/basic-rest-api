import { z } from "zod";

const authorSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
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

export { authorSchema };
