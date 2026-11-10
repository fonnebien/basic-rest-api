# Use native Node subpath imports instead of path aliases

Internal imports use `#api/*`, `#domain/*`, `#infrastructure/*` and `#middleware/*`, declared once in the `imports` field of `package.json`. Each entry has a `source` condition (pointing at `src/`) and a `default` condition (pointing at `dist/`). `tsc` (`customConditions`), `tsx` (`--conditions=source`) and Vitest (`resolve.conditions`) enable `source`; plain `node dist/server.js` uses `default`.

The previous `@` aliases lived in `tsconfig.json` and `vitest.config.ts`, and `tsc` does not rewrite them, so `pnpm start` crashed on the first aliased import. Considered and rejected: a bundler (a new build tool for a project that has none) and relative imports (no config, but long `../../` paths); relative imports remain the fallback if this setup ever becomes a burden.

Consequence: a new top-level directory under `src/` that needs an import prefix must be added to `imports` in `package.json` only.
