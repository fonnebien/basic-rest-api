import type { LoggerPort } from "@domain/ports/logger.port.js";
import {
  type Book,
  type BookCreation,
  type BookUpdate,
} from "@models/book.model.js";
import type { BookRepository } from "@repositories/book.repository.js";

export class BookService {
  constructor(
    private repository: BookRepository,
    private logger: LoggerPort,
  ) {}

  async getAllBooks(): Promise<Book[]> {
    this.logger.info("Fetching all books");
    return this.repository.findAll();
  }

  async getBookById(id: string): Promise<Book | null> {
    this.logger.info(`Fetching book with ID: ${id}`);
    return this.repository.findById(id);
  }

  async createBook(book: BookCreation): Promise<Book> {
    this.logger.info("Creating a new book");
    return this.repository.create({ ...book, id: crypto.randomUUID() });
  }

  async updateBook(id: string, changes: BookUpdate): Promise<Book | null> {
    this.logger.info(`Updating book with ID: ${id}`);
    return this.repository.update(id, changes);
  }

  async deleteBook(id: string): Promise<boolean> {
    this.logger.info(`Deleting book with ID: ${id}`);
    return this.repository.delete(id);
  }

  async searchBooks(query: string): Promise<Book[]> {
    this.logger.info(`Searching books with query: ${query}`);

    const books = await this.repository.findAll();
    return books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase()),
    );
  }
}
