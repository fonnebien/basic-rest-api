import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";
import path from "node:path";
import tseslint from "typescript-eslint";

const gitignorePath = path.resolve(import.meta.dirname, "./.gitignore");

export default defineConfig([
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          fixStyle: "inline-type-imports",
        },
      ],
      "import/extensions": [
        "error",
        "always",
        {
          ignorePackages: true,
        },
      ],
    },
  },
]);
