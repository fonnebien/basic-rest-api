import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = (path: string) =>
  fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@api\//, replacement: src("api/") },
      { find: /^@domain\//, replacement: src("domain/") },
      { find: /^@models\//, replacement: src("domain/models/") },
      { find: /^@services\//, replacement: src("domain/services/") },
      { find: /^@errors\//, replacement: src("domain/errors/") },
      { find: /^@repositories\//, replacement: src("domain/repositories/") },
      { find: /^@infrastructure\//, replacement: src("infrastructure/") },
      { find: /^@middleware\//, replacement: src("middleware/") },
    ],
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
