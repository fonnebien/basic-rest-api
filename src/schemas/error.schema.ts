import { z } from "zod";

const errorResponseSchema = z.object({
  error: z.string(),
});
type ErrorResponseSchema = z.infer<typeof errorResponseSchema>;

export { errorResponseSchema, type ErrorResponseSchema };
