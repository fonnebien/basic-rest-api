import { zValidator } from "@hono/zod-validator";
import { ValidationError } from "@domain/errors/api-error.classes.js";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";

/**
 * zValidator that reports failures as a typed ValidationError, so they are
 * formatted by the global error handler like every other API error.
 */
export const validate = <
  Target extends keyof ValidationTargets,
  Schema extends ZodType,
>(
  target: Target,
  schema: Schema,
) =>
  zValidator(target, schema, (result) => {
    if (!result.success) {
      throw new ValidationError(
        result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
        `Invalid request ${target}`,
      );
    }
  });
