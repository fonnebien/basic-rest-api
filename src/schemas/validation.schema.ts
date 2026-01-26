import { z } from 'zod';

const idValidationSchema = z.object({
  id: z.uuid({
    error: 'Invalid UUID format for ID',
  }),
});
type IdValidationSchema = z.infer<typeof idValidationSchema>;

export { idValidationSchema, type IdValidationSchema };
