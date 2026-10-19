import { serve } from "@hono/node-server";
import { Logger } from "@infrastructure/logger/pino.logger.js";
import { app } from "./app.js";

const logger = Logger.getInstance("api:server");

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
