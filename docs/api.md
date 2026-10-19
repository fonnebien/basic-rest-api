# API

## Authors

| Method   | Endpoint                 | Description            |
| -------- | ------------------------ | ---------------------- |
| `GET`    | `/authors`               | Get all authors        |
| `GET`    | `/authors/search?query=` | Search authors by name |
| `GET`    | `/authors/:id`           | Get author by ID       |
| `POST`   | `/authors`               | Create a new author    |
| `PUT`    | `/authors/:id`           | Update an author       |
| `DELETE` | `/authors/:id`           | Delete an author       |

## Books

| Method   | Endpoint               | Description           |
| -------- | ---------------------- | --------------------- |
| `GET`    | `/books`               | Get all books         |
| `GET`    | `/books/search?query=` | Search books by title |
| `GET`    | `/books/:id`           | Get book by ID        |
| `POST`   | `/books`               | Create a new book     |
| `PUT`    | `/books/:id`           | Update a book         |
| `DELETE` | `/books/:id`           | Delete a book         |

## Error Handling

Errors are thrown as typed classes from `src/domain/errors/api-error.classes.ts` (all extend `ApiError`, which extends `Error`) and turned into responses by `app.onError`. The interfaces they implement live in `api-error.types.ts`.

| Class                   | Status | Code                    | Extra response fields                   |
| ----------------------- | ------ | ----------------------- | --------------------------------------- |
| `ValidationError`       | 400    | `VALIDATION_ERROR`      | `invalidFields`                         |
| `BadRequestError`       | 400    | `BAD_REQUEST`           | `invalidParameters`                     |
| `AuthenticationError`   | 401    | `AUTHENTICATION_ERROR`  | `authFailure`                           |
| `AuthorizationError`    | 403    | `AUTHORIZATION_ERROR`   | `requiredPermission`, `requiredRole`    |
| `ResourceNotFoundError` | 404    | `RESOURCE_NOT_FOUND`    | `resource`, `identifier`                |
| `ConflictError`         | 409    | `CONFLICT`              | `conflictingResource`, `conflictReason` |
| `RateLimitError`        | 429    | `RATE_LIMIT_EXCEEDED`   | `retryAfter`, `limit`, `remaining`      |
| `ServerError`           | 500    | `INTERNAL_SERVER_ERROR` | `trace` (omitted in production)         |

Example response for `new ResourceNotFoundError("Author", "42")`:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Author with id '42' was not found."
  },
  "resource": "Author",
  "identifier": "42"
}
```

Endpoints use them directly: an unknown id throws `ResourceNotFoundError` (404), a missing `query` on `/search` throws `BadRequestError` (400), and request validation failures are reported as `ValidationError` (400) by the `validate()` middleware, which wraps `@hono/zod-validator`:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request json"
  },
  "invalidFields": [{ "field": "title", "message": "Title is required" }]
}
```

Malformed JSON bodies return `400 BAD_REQUEST`.

Unexpected (non-`ApiError`) errors become a generic `500 INTERNAL_SERVER_ERROR` without the original message. Hono only passes `Error` instances to `onError`, which is why the typed errors are classes.
