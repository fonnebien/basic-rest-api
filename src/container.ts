import type { LoggerFactory } from "#domain/ports/logger.port.js";
import { InMemoryAuthorRepository } from "#infrastructure/repositories/in-memory-author.repository.js";
import { InMemoryBookRepository } from "#infrastructure/repositories/in-memory-book.repository.js";
import { AuthorService } from "#domain/services/author.service.js";
import { BookService } from "#domain/services/book.service.js";

export const createContainer = ({
  createLogger,
}: {
  createLogger: LoggerFactory;
}) => ({
  authorService: new AuthorService(
    new InMemoryAuthorRepository(),
    createLogger("api:service:author"),
  ),
  bookService: new BookService(
    new InMemoryBookRepository(),
    createLogger("api:service:book"),
  ),
});
