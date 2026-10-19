# Development

## Scripts

```bash
pnpm dev     # Start development server (with hot reload)
pnpm build   # Compile TypeScript to dist/
pnpm start   # Start production server (requires a build)
```

## Testing

Jest runs in ESM mode via ts-jest (the scripts pass `--experimental-vm-modules`, so a Node experimental warning is expected).

```bash
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
```

Tests live next to the code as `*.test.ts`. Service tests inject in-memory fakes from `src/domain/testing/` (`Fake*Repository`, `silentLogger`) instead of touching infrastructure. Endpoint tests (`*.endpoint.test.ts`, `app.test.ts`) call the real Hono app through `app.request()`. `createTestApp()` in `src/testing/` builds it with `createApp()` and fake repositories, so no server or port is needed. `LOG_LEVEL=silent` is set in `jest.setup.js` to keep test output clean. Test files and every `testing/` folder are excluded from the `tsc` build.

## Code Quality

```bash
pnpm format:check   # Check formatting
pnpm format         # Fix formatting
pnpm lint:check     # Check linting
pnpm lint           # Fix linting
```

## Goals & Practices

This repo is used to explore and solidify:

- Clean Architecture & separation of concerns
- Typed error handling in TypeScript
- Input validation patterns
- REST API design conventions
- Tooling setup (ESLint, Prettier, pnpm workspaces, tsconfig)
