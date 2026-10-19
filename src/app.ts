import { createApiV1Router, type ApiV1Services } from "@api/v1/v1.router.js";
import { errorHandler } from "@middleware/error-handler.middleware.js";
import { Logger } from "@infrastructure/logger/pino.logger.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import type { RequestIdVariables } from "hono/request-id";
import { requestId } from "hono/request-id";

const logger = Logger.getInstance("api:app");

export const createApp = (services: ApiV1Services) => {
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

  app.onError(errorHandler);

  return app;
};
