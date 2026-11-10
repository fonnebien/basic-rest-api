import { createApiV1Router, type ApiV1Services } from "#api/v1/v1.router.js";
import { createErrorHandler } from "#api/middleware/error-handler.middleware.js";
import type { LoggerFactory } from "#domain/ports/logger.port.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import type { RequestIdVariables } from "hono/request-id";
import { requestId } from "hono/request-id";

export interface AppOptions {
  createLogger: LoggerFactory;
  isProduction: boolean;
}

export const createApp = (
  services: ApiV1Services,
  { createLogger, isProduction }: AppOptions,
) => {
  const logger = createLogger("api:app");
  const app = new Hono<{ Variables: RequestIdVariables }>();

  app.use(cors());
  app.use(
    prettyJSON({
      space: 2,
    }),
  );
  app.use(requestId());

  app.route("/api/v1", createApiV1Router(services));

  app.get("/health", (c) => {
    logger.info("Health check");
    c.status(200);
    return c.json({ status: "ok" });
  });

  app.all("*", (c) => {
    logger.info("Request received", {
      method: c.req.method,
      path: c.req.path,
    });
    c.status(404);
    return c.json({ error: "Not Found" });
  });

  app.onError(
    createErrorHandler({
      logger: createLogger("api:middleware:error-handler"),
      isProduction,
    }),
  );

  return app;
};
