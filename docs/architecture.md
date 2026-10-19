# Architecture

## Project Structure

```text
src
├── api/
│   └── v1/
│       ├── endpoints/       # Router factories per resource (*.endpoint.ts)
│       ├── responses/       # Typed HTTP response shapes (e.g. error response)
│       ├── schemas/         # Zod request schemas (*.schema.ts)
│       └── v1.router.ts     # v1 router composition (createApiV1Router)
├── domain/                  # Business logic — no external dependencies
│   ├── errors/              # Typed error interfaces (*.types.ts) and Error classes (*.classes.ts)
│   ├── models/              # Plain domain types (Author, Book)
│   ├── ports/               # Interfaces for outward needs (LoggerPort)
│   ├── repositories/        # Repository interfaces (implemented in infrastructure)
│   ├── services/            # Business logic per resource (+ colocated *.test.ts)
│   └── testing/             # Test doubles: fake repositories, silent logger
├── infrastructure/
│   ├── data/                # JSON data files (authors.json, books.json)
│   ├── logger/              # Pino-backed LoggerPort implementation
│   └── repositories/        # In-memory repository implementations
├── middleware/
│   ├── error-handler.middleware.ts  # Global error handler (app.onError)
│   └── validate.middleware.ts       # zValidator wrapper that throws ValidationError
├── app.ts                   # createApp(services): middleware, routes, error handler
├── testing/                 # createTestApp(): app wired with fakes for tests
├── container.ts             # Composition root: wires repositories into services
└── server.ts                # Entry point: createApp(container services) + serve
```

## Naming convention

Files are kebab-case and named `<name>.<role>.ts`, for example `book.service.ts`, `in-memory-book.repository.ts`, `id.schema.ts`. Roles in use: `model`, `service`, `repository`, `port`, `endpoint`, `schema`, `router`, `middleware`, `types`, `classes`, `logger`. The composition files at the `src/` root (`app.ts`, `container.ts`, `server.ts`) are the exception.

## Validation

Request validation lives in the API layer: Zod schemas in `api/v1/schemas/` are applied with `zValidator` in the endpoints. The domain only knows plain TypeScript types, so it does not depend on Zod.

## Principles

The project follows **Clean Architecture** principles — dependencies always point inward. The `domain/` layer has zero knowledge of Hono, JSON files, or any infrastructure concern.

## Dependency wiring

Services receive their repository and logger through the constructor. `container.ts` is the only place that picks concrete implementations, and `app.ts` passes the services to the routers. To swap the data store, add a new `BookRepository`/`AuthorRepository` implementation in `infrastructure/` and change `container.ts`.
