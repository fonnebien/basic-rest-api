# basic-rest-api

A personal REST API playground built to practice and maintain knowledge on backend best practices — clean architecture, proper error handling, validation, and TypeScript tooling.

## Tech Stack

- **Runtime** — [Node.js](https://nodejs.org) (version managed via `.nvmrc`)
- **Framework** — [Hono](https://hono.dev)
- **Language** — TypeScript
- **Package Manager** — pnpm (workspace setup)
- **Linting** — ESLint
- **Formatting** — Prettier

## Project Structure

```text
src
├── api/
│   └── v1/
│       ├── endpoints/       # Route handlers per resource (authors, books)
│       ├── responses/       # Typed HTTP response shapes (e.g. error response)
│       └── router.ts        # v1 router composition
├── core/
│   ├── data/                # JSON data files (authors.json, books.json)
│   └── index.ts             # Core bootstrapping
├── domain/                  # Business logic — no external dependencies
│   ├── errors/              # Typed error interfaces
│   ├── models/              # Domain entities (Author, Book)
│   └── services/            # Business logic per resource
├── middleware/
│   └── error-handler.ts     # Global error handling middleware
├── routes/
│   └── index.ts             # Top-level route registration
├── utils/
│   └── logger.util.ts       # Logging utility
├── validations/
│   └── id.schema.ts         # Shared input validation schemas
└── index.ts                 # App entry point
```

The project follows **Clean Architecture** principles — dependencies always point inward. The `domain/` layer has zero knowledge of Hono, JSON files, or any infrastructure concern.

## Getting Started

**Prerequisites:** Node.js (see `.nvmrc`), pnpm

```bash
# Install dependencies
pnpm install

# Start development server (with hot reload)
pnpm dev

# Build
pnpm build

# Start production server
pnpm start
```

## Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Code Quality

```bash
# Check formatting
pnpm format:check

# Fix formatting
pnpm format

# Check linting
pnpm lint:check

# Fix linting
pnpm lint
```

## API Endpoints

### Authors

| Method   | Endpoint       | Description         |
| -------- | -------------- | ------------------- |
| `GET`    | `/authors`     | Get all authors     |
| `GET`    | `/authors/:id` | Get author by ID    |
| `POST`   | `/authors`     | Create a new author |
| `PUT`    | `/authors/:id` | Update an author    |
| `DELETE` | `/authors/:id` | Delete an author    |

### Books

| Method   | Endpoint     | Description       |
| -------- | ------------ | ----------------- |
| `GET`    | `/books`     | Get all books     |
| `GET`    | `/books/:id` | Get book by ID    |
| `POST`   | `/books`     | Create a new book |
| `PUT`    | `/books/:id` | Update a book     |
| `DELETE` | `/books/:id` | Delete a book     |

## Error Handling

All errors follow a consistent typed structure:

```json
{
  "code": "RESOURCE_NOT_FOUND",
  "message": "Author with id '42' was not found.",
  "status": 404
}
```

Specialised error types include `ValidationError`, `AuthenticationError`, `AuthorizationError`, `ResourceNotFoundError`, `RateLimitError`, `ConflictError`, and `ServerError`.

## Goals & Practices

This repo is used to explore and solidify:

- Clean Architecture & separation of concerns
- Typed error handling in TypeScript
- Input validation patterns
- REST API design conventions
- Tooling setup (ESLint, Prettier, pnpm workspaces, tsconfig)
