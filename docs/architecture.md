# Architecture

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

## Principles

The project follows **Clean Architecture** principles — dependencies always point inward. The `domain/` layer has zero knowledge of Hono, JSON files, or any infrastructure concern.
