import { serve } from "@hono/node-server";
import { apiV1Router } from "@routes/index.js";
import { Logger } from "@utils/logger.util.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import type { RequestIdVariables } from "hono/request-id";
import { requestId } from "hono/request-id";

const app = new Hono<{ Variables: RequestIdVariables }>();
const logger = Logger.getInstance("api:index");

app.use(cors());
app.use(
  prettyJSON({
    space: 2,
  }),
);
app.use(requestId());

app.route("/api/v1", apiV1Router);

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

serve(
  {
    fetch: app.fetch,
    port: 3000,
    hostname: "localhost",
  },
  (info) => {
    logger.info(`Server is running at ${info.port}`);
  },
);
