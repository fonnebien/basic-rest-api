import { InMemoryAuthorRepository } from "#infrastructure/repositories/in-memory-author.repository.js";
import { InMemoryBookRepository } from "#infrastructure/repositories/in-memory-book.repository.js";
import { AuthorService } from "#domain/services/author.service.js";
import { BookService } from "#domain/services/book.service.js";
import { Logger } from "#infrastructure/logger/pino.logger.js";

export const authorService = new AuthorService(
  new InMemoryAuthorRepository(),
  Logger.getInstance("api:service:author"),
);

export const bookService = new BookService(
  new InMemoryBookRepository(),
  Logger.getInstance("api:service:book"),
);
