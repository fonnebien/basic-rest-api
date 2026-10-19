# Architecture

## Project Structure

```text
src
├── api/
│   └── v1/
│       ├── endpoints/       # Router factories per resource (authors, books)
│       ├── responses/       # Typed HTTP response shapes (e.g. error response)
│       └── router.ts        # v1 router composition (createApiV1Router)
├── domain/                  # Business logic — no external dependencies
│   ├── errors/              # Typed error interfaces
│   ├── models/              # Domain entities (Author, Book)
│   ├── ports/               # Interfaces for outward needs (LoggerPort)
│   ├── repositories/        # Repository interfaces (implemented in infrastructure)
│   └── services/            # Business logic per resource
├── infrastructure/
│   ├── data/                # JSON data files (authors.json, books.json)
│   └── repositories/        # In-memory repository implementations
├── middleware/
│   └── error-handler.ts     # Global error handler (app.onError)
├── utils/
│   └── logger.util.ts       # Logging utility
├── validations/
│   └── id.schema.ts         # Shared input validation schemas
├── app.ts                   # Hono app: middleware, routes, error handler
├── container.ts             # Composition root: wires repositories into services
└── server.ts                # Entry point: starts the HTTP server
```

## Principles

The project follows **Clean Architecture** principles — dependencies always point inward. The `domain/` layer has zero knowledge of Hono, JSON files, or any infrastructure concern.

## Dependency wiring

Services receive their repository and logger through the constructor. `container.ts` is the only place that picks concrete implementations, and `app.ts` passes the services to the routers. To swap the data store, add a new `BookRepository`/`AuthorRepository` implementation in `infrastructure/` and change `container.ts`.
