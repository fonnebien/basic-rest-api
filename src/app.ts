import { createApiV1Router } from "@api/v1/router.js";
import { errorHandler } from "@middleware/error-handler.js";
import { Logger } from "@utils/logger.util.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import type { RequestIdVariables } from "hono/request-id";
import { requestId } from "hono/request-id";
import { authorService, bookService } from "./container.js";

export const app = new Hono<{ Variables: RequestIdVariables }>();
const logger = Logger.getInstance("api:app");

app.use(cors());
app.use(
  prettyJSON({
    space: 2,
  }),
);
app.use(requestId());

app.route("/api/v1", createApiV1Router({ authorService, bookService }));

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
