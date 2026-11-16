import { serve } from "@hono/node-server";
import { createLoggerFactory } from "#infrastructure/logger/pino.logger.js";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createContainer } from "./container.js";

const config = loadConfig();
const createLogger = createLoggerFactory(config.logLevel);
const logger = createLogger("api:server");

const app = createApp(createContainer({ createLogger }), {
  createLogger,
  isProduction: config.isProduction,
});

serve(
  {
    fetch: app.fetch,
    port: config.port,
    hostname: config.host,
  },
  (info) => {
    logger.info(`Server is running at ${info.port}`);
  },
);
