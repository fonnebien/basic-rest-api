import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.js";

describe("loadConfig", () => {
  it("applies defaults for an empty environment", () => {
    expect(loadConfig({})).toEqual({
      port: 3000,
      host: "localhost",
      logLevel: "info",
      isProduction: false,
    });
  });

  it("reads and coerces values from the environment", () => {
    expect(
      loadConfig({
        NODE_ENV: "production",
        PORT: "8080",
        HOST: "0.0.0.0",
        LOG_LEVEL: "silent",
      }),
    ).toEqual({
      port: 8080,
      host: "0.0.0.0",
      logLevel: "silent",
      isProduction: true,
    });
  });

  it("rejects invalid values", () => {
    expect(() => loadConfig({ PORT: "abc" })).toThrow();
    expect(() => loadConfig({ LOG_LEVEL: "loud" })).toThrow();
  });
});
