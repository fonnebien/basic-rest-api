# API

## Authors

| Method   | Endpoint       | Description         |
| -------- | -------------- | ------------------- |
| `GET`    | `/authors`     | Get all authors     |
| `GET`    | `/authors/:id` | Get author by ID    |
| `POST`   | `/authors`     | Create a new author |
| `PUT`    | `/authors/:id` | Update an author    |
| `DELETE` | `/authors/:id` | Delete an author    |

## Books

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
