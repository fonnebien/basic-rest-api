import type { LoggerPort } from "@domain/ports/logger.port.js";

export const silentLogger: LoggerPort = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};
