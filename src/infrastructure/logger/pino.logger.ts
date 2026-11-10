import type { LoggerFactory, LoggerPort } from "#domain/ports/logger.port.js";
import { type Logger as PinoLogger, pino } from "pino";
import pinoPretty from "pino-pretty";

export class Logger implements LoggerPort {
  private static instances: Map<string, Logger> = new Map();
  private logger: PinoLogger;
  private serviceName: string;

  private constructor(serviceName: string, level: string) {
    this.serviceName = serviceName;

    const prettyStream = pinoPretty({
      colorize: true,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
    });

    this.logger = pino(
      {
        level,
        name: serviceName,
      },
      prettyStream,
    );
  }

  public static getInstance(serviceName = "default", level = "info"): Logger {
    const key = `${level}:${serviceName}`;
    if (!Logger.instances.has(key)) {
      Logger.instances.set(key, new Logger(serviceName, level));
    }
    return Logger.instances.get(key)!;
  }

  public debug(message: string, ...args: Record<string, unknown>[]): void {
    this.logger.debug(
      args.length
        ? { service: this.serviceName, message, ...args[0] }
        : { service: this.serviceName, message },
    );
  }

  public info(message: string, ...args: Record<string, unknown>[]): void {
    this.logger.info(
      args.length
        ? { service: this.serviceName, message, ...args[0] }
        : { service: this.serviceName, message },
    );
  }

  public warn(message: string, ...args: Record<string, unknown>[]): void {
    this.logger.warn(
      args.length
        ? { service: this.serviceName, message, ...args[0] }
        : { service: this.serviceName, message },
    );
  }

  public error(
    message: string,
    error?: Error,
    ...args: Record<string, unknown>[]
  ): void {
    if (error) {
      this.logger.error({
        service: this.serviceName,
        message,
        err: error,
        ...(args.length ? args[0] : {}),
      });
    } else {
      this.logger.error(
        args.length
          ? { service: this.serviceName, message, ...args[0] }
          : { service: this.serviceName, message },
      );
    }
  }
}

export const createLoggerFactory =
  (level: string): LoggerFactory =>
  (name) =>
    Logger.getInstance(name, level);
