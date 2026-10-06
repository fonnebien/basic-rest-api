# Development

## Scripts

```bash
pnpm dev     # Start development server (with hot reload)
pnpm build   # Compile TypeScript to dist/
pnpm start   # Start production server (requires a build)
```

## Testing

Jest is set up, but no tests have been written yet.

```bash
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
```

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
