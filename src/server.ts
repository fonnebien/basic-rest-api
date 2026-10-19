import { serve } from "@hono/node-server";
import { Logger } from "@infrastructure/logger/pino.logger.js";
import { createApp } from "./app.js";
import { authorService, bookService } from "./container.js";

const logger = Logger.getInstance("api:server");
const app = createApp({ authorService, bookService });

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
