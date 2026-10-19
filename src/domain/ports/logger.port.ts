export interface LoggerPort {
  debug(message: string, ...args: Record<string, unknown>[]): void;
  info(message: string, ...args: Record<string, unknown>[]): void;
  warn(message: string, ...args: Record<string, unknown>[]): void;
  error(
    message: string,
    error?: Error,
    ...args: Record<string, unknown>[]
  ): void;
}
