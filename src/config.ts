import { z } from "zod";

const configSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().min(1).default("localhost"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
});

export interface Config {
  port: number;
  host: string;
  logLevel: z.infer<typeof configSchema>["LOG_LEVEL"];
  isProduction: boolean;
}

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): Config => {
  const parsed = configSchema.parse(env);

  return {
    port: parsed.PORT,
    host: parsed.HOST,
    logLevel: parsed.LOG_LEVEL,
    isProduction: parsed.NODE_ENV === "production",
  };
};
